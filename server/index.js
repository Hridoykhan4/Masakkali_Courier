require("dotenv").config();
const stripe = require("stripe")(process.env.Stripe_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@happiness-hill.1es2bek.mongodb.net/?appName=Happiness-Hill`;
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const calculateParcelCost = require("./utils/calculateParcelCost");

//Middleware
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
    /* Parcel APIs */

    app.get("/parcels", async (req, res) => {
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

    app.get("/parcels/:id", async (req, res) => {
      res.send(
        await parcelCollection.findOne({ _id: new ObjectId(req.params.id) })
      );
    });

    app.post("/parcels", async (req, res) => {
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

    app.delete("/parcels/:id", async (req, res) => {
      res.send(
        await parcelCollection.deleteOne({ _id: new ObjectId(req.params.id) })
      );
    });

    /* Parcel APIs */

    /* Payment APIS */

    app.get("/payments", async (req, res) => {
      const { email } = req?.query;
      const query = email ? { email } : {};
      const options = { sort: { paidAt: -1 } };
      const payments = await paymentCollection.find(query, options).toArray();
      res.send(payments);
    });

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
        { $set: { payment_status: "paid" } }
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
      "Pinged your deployment. You successfully connected to MongoDB!"
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
