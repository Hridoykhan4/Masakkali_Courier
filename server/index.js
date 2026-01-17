require("dotenv").config();
const stripe = require("stripe")(process.env.Stripe_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@happiness-hill.1es2bek.mongodb.net/?appName=Happiness-Hill`;
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 5000;
const calculateParcelCost = require("./utils/calculateParcelCost");

var serviceAccount = require("./firebase-admin-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//Middlewares
// app.use(
//   cors({
//     origin: [
//       "https://9jnv16dr-5000.asse.devtunnels.ms",
//       "http://localhost:5173",
//     ],
//   })
// );
app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Internal Server Error" });
});

const verifyFBToken = async (req, res, next) => {
  const authHeaders = req.headers?.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer "))
    return res.status(401).send({ message: "Unauthorized Access" });
  const token = authHeaders.split(` `)[1];

  try {
    const userInfo = await admin.auth().verifyIdToken(token);
    req.tokenEmail = userInfo.email;
    next();
  } catch (err) {
    return res.status(403).send({ message: "Forbidden" });
  }
};

const verifyAuthorizeEmail = (req, res, next) => {
  const { email } = req?.query || req?.params;
  if (req.tokenEmail !== email)
    return res.status(403).send({ message: "Forbidden Access" });
  next();
};

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("Masakkali");
    const reviewCollection = db.collection("reviews");
    const parcelCollection = db.collection("parcel");
    const paymentCollection = db.collection("payment");
    const trackingCollection = db.collection("tracking");
    const userCollection = db.collection("users");
    const ridersCollection = db.collection("riders");

    /* USER APIS------ */
    app.post("/users", async (req, res) => {
      const { email, lastLoggedIn } = req.body;
      if (await userCollection.findOne({ email })) {
        await userCollection.updateOne({ email }, { $set: { lastLoggedIn } });
        return res.status(200).send({
          message: "User already exists",
          insertedId: false,
          exists: true,
        });
      }
      const user = req.body;
      res.send(await userCollection.insertOne(user));
    });

    app.get("/users", async (req, res) => {
      res.send(await userCollection.find().toArray());
    });

    /* USER APIS------ */

    /* RIDERS APIS */
    app.get("/riders", async (req, res) => {
      res.send(await ridersCollection.find().toArray());
    });

    app.get("/riders/pending", async (req, res) => {
      try {
        res.send(
          await ridersCollection
            .find({ status: "pending" })
            .sort({ appliedAt: -1 })
            .toArray(),
        );
      } catch (err) {
        res.status(500).send({ message: "Failed to load pending riders" });
      }
    });

    app.get("/riders/active", async (req, res) => {
      try {
        const result = await ridersCollection
          .find({ status: "approved" })
          .sort({ reviewedAt: -1 })
          .toArray();
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to load Active riders" });
      }
    });

    app.post("/riders", verifyFBToken, async (req, res) => {
      const {
        name,
        age,
        region,
        district,
        nid,
        bikeBrand,
        bikeRegistration,
        phone,
      } = req.body;

      if (
        !name ||
        !age ||
        !region ||
        !district ||
        !nid ||
        !bikeBrand ||
        !bikeRegistration ||
        !phone
      ) {
        return res.status(400).send({ message: "Missing required fields" });
      }

      if (age < 18) {
        return res.status(400).send({ message: "Must be at least 18" });
      }

      const existing = await ridersCollection.findOne({
        email: req.tokenEmail,
        status: { $in: ["pending", "approved"] },
      });

      if (existing) {
        return res.status(409).send({
          message: "You already have an active application",
        });
      }

      const rider = {
        name,
        email: req.tokenEmail,
        age: Number(age),
        region,
        district,
        nid,
        bikeBrand,
        bikeRegistration,
        phone,
        status: "pending",
        appliedAt: new Date(),
        reviewedAt: null,
      };

      const result = await ridersCollection.insertOne(rider);
      res.send(result);
    });

    app.patch("/riders/:id", async (req, res) => {
      const { id } = req.params;
      const { status, reviewedAt } = req.body;
      const result = await ridersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, reviewedAt } },
      );
      res.send(result);
    });

    app.patch("/riders/:id/deactivate", async (req, res) => {
      const { id } = req.params;

      const result = await ridersCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "inactive",
            reviewedAt: new Date(),
          },
        },
      );

      res.send(result);
    });

    /* RIDERS APIS */

    /* Parcel APIs */

    app.get("/parcels", verifyFBToken, async (req, res) => {
      try {
        const userEmail = req.query?.email;
        const query = userEmail ? { created_by: userEmail } : {};
        const options = { sort: { creation_date: -1 } };
        const parcels = await parcelCollection.find(query, options).toArray();
        res.send(parcels);
      } catch (err) {
        console.log(err);
      }
    });

    app.get("/parcels/:id", verifyFBToken, async (req, res) => {
      res.send(
        await parcelCollection.findOne({ _id: new ObjectId(req.params.id) }),
      );
    });

    app.post("/parcels", verifyFBToken, async (req, res) => {
      try {
        const {
          parcelType,
          weight,
          cost: frontendCost,
          receiverRegion,
          senderRegion,
          trackingId,
        } = req.body;

        const actualCost = calculateParcelCost({
          isSameRegion: receiverRegion === senderRegion,
          weight,
          type: parcelType,
        });
        console.log(frontendCost, actualCost.total);
        if (frontendCost !== actualCost.total) {
          return res.status(400).json({
            message: "Parcel cost mismatch. Please refresh and try again.",
          });
        }
        await trackingCollection.insertOne({
          trackingId,
          status: "Created",
          message: "Parcel Created Successfully",
          location: senderRegion,
          createdAt: new Date(),
        });
        res.status(201).send(await parcelCollection.insertOne(req?.body));
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to create parcel" });
      }
    });

    app.delete("/parcels/:id", verifyFBToken, async (req, res) => {
      res.send(
        await parcelCollection.deleteOne({ _id: new ObjectId(req.params.id) }),
      );
    });

    /* Parcel APIs */

    /* Payment APIS */

    app.get(
      "/payments",
      verifyFBToken,
      verifyAuthorizeEmail,
      async (req, res) => {
        const { email } = req?.query;
        const query = { email };
        const options = { sort: { paidAt: -1 } };
        const payments = await paymentCollection.find(query, options).toArray();
        res.send(payments);
      },
    );

    app.post("/create-payment-intent", async (req, res) => {
      const { cost } = req.body;
      const amountInCents = Math.round(cost * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.post("/payments", async (req, res) => {
      const { parcelId, email, amount, transactionId, paymentMethod, name } =
        req.body;
      console.log(req.body);
      if (!parcelId || !email || !amount)
        return res
          .status(400)
          .send({ message: "parcelId, email and amount are required" });

      const updateResult = await parcelCollection.updateOne(
        { _id: new ObjectId(parcelId) },
        { $set: { payment_status: "paid" } },
      );

      if (updateResult.modifiedCount === 0)
        return res
          .status(404)
          .send({ message: "Parcel not found or already paid" });

      const paymentDoc = {
        parcelId,
        email,
        amount,
        transactionId,
        paymentMethod,
        paidAt: new Date(),
        paidAtString: new Date().toISOString(),
        name,
      };
      const paymentResult = await paymentCollection.insertOne(paymentDoc);
      res.send({
        message: "Payment recorded and parcel marked as paid",
        insertedId: paymentResult.insertedId,
      });
    });

    /* Payment APIS */

    /* Tracking APIS */
    app.get("/track/:trackingId", async (req, res) => {
      const { trackingId } = req.params;

      const parcel = await parcelCollection.findOne({
        trackingId,
      });
      if (!parcel) {
        return res.status(404).send({ message: "Invalid tracking ID" });
      }

      const trackingHistory = await trackingCollection
        .find({ trackingId })
        .sort({ createdAt: 1 })
        .toArray();

      res.send({
        parcel,
        trackingHistory,
      });
    });

    app.get("/reviews", async (req, res) => {
      res.send(await reviewCollection.find().toArray());
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Ur Masakkali Ur");
});

app.listen(port, () => {
  console.log(`Bistro is running on PORT: ${port}`);
});
