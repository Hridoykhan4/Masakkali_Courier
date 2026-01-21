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

    /* UTILITY FUNC */

    const logTracking = async (trackingId, status, message, location) => {
      await trackingCollection.insertOne({
        trackingId,
        status,
        message,
        location: location || "Processing Center",
        createdAt: new Date(),
      });
    };
    /* UTILITY FUNC */

    /* Middleware */
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

    const verifyAuthorizeEmail = (source = "params") => {
      return (req, res, next) => {
        const email = req[source]?.email;
        if (!email) {
          return res
            .status(400)
            .send({ message: "Email parameter is missing from request" });
        }
        if (req.tokenEmail?.toLowerCase() !== email.toLowerCase()) {
          return res.status(403).send({
            message:
              "Forbidden Access: You cannot access data belonging to another user.",
          });
        }
        next();
      };
    };

    const verifyAdmin = async (req, res, next) => {
      const tokenEmail = req?.tokenEmail;
      const user = await userCollection.findOne({ email: tokenEmail });
      if (!user || user?.role !== "admin")
        return res.status(403).send({ message: "Admin access required" });
      next();
    };

    const verifyRider = async (req, res, next) => {
      const tokenEmail = req?.tokenEmail;
      const user = await userCollection.findOne({ email: tokenEmail });
      if (!user || user?.role !== "rider")
        return res.status(403).send({ message: "Rider access required" });
      next();
    };

    /* Middleware */

    /* USER APIS------ */

    app.get("/users/search", async (req, res) => {
      const { searchQuery } = req.query;
      if (!searchQuery) {
        return res.status(400).send({ message: "Missing search query" });
      }
      const users = await userCollection
        .find({
          $or: [
            { email: { $regex: searchQuery, $options: "i" } },
            { name: { $regex: searchQuery, $options: "i" } },
          ],
        })
        .toArray();
      res.send(users);
    });

    // Getting the role of a user
    app.get("/users/:email/role", verifyFBToken, async (req, res) => {
      try {
        const email = req.params.email;
        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }
        if (email !== req.tokenEmail) {
          return res.status(403).send({ message: "Forbidden Access" });
        }
        const user = await userCollection.findOne({ email });
        if (!user) {
          return res.status(404).send({ message: "Users not found" });
        }
        res.send({ role: user?.role || "user" });
      } catch (err) {
        res.status(500).send({ message: "Failed to get role" });
      }
    });

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

    app.patch(
      "/users/:id/role",
      verifyFBToken,
      verifyAdmin,
      async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;

        if (!["admin", "user"].includes(role)) {
          return res.status(400).send({ message: "Invalid role" });
        }

        const user = await userCollection.findOne({ _id: new ObjectId(id) });

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        if (user.role === "rider") {
          return res.status(403).send({
            message: "Riders cannot be promoted to admin",
          });
        }

        const result = await userCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { role, updatedAt: new Date() } },
        );
        res.send({ message: `User role updated to ${role}`, result });
      },
    );

    /* USER APIS------ */

    /* RIDERS APIS */
    app.get("/riders", async (req, res) => {
      res.send(await ridersCollection.find().toArray());
    });

    app.get("/riders/pending", verifyFBToken, verifyAdmin, async (req, res) => {
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

    app.get("/riders/available", verifyFBToken, async (req, res) => {
      const { district } = req.query;
      if (!district) {
        return res.status(400).send({ message: "District required" });
      }

      const riders = await ridersCollection
        .find({ district, status: "approved" })
        .toArray();
      res.send(riders);
    });

    app.get("/riders/active", verifyFBToken, verifyAdmin, async (req, res) => {
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

    app.get("/rider/tasks", verifyFBToken, async (req, res) => {
      try {
        const rider = await ridersCollection.findOne({
          email: req.tokenEmail,
          status: "approved",
        });

        if (!rider) {
          return res.status(403).send({ message: "Rider not found" });
        }

        const parcels = await parcelCollection
          .find({
            rider_id: rider._id.toString(),
            delivery_status: { $in: ["assigned", "in-transit"] },
          })
          .sort({ assigned_at: -1 })
          .toArray();
        res.send(parcels);
      } catch (err) {
        res.status(500).send({ message: "Failed to load rider tasks" });
      }
    });

    app.get("/rider/completed-deliveries", verifyFBToken, async (req, res) => {
      try {
        const email = req.tokenEmail;
        const rider = await ridersCollection.findOne({ email });

        if (!rider) {
          return res.status(404).send({ message: "Rider not found" });
        }

        const riderIdString = rider._id.toString();

        const deliveries = await parcelCollection
          .find({
            rider_id: riderIdString,
            delivery_status: {
              $in: ["delivered", "delivered-to-service-center"],
            },
          })
          .sort({ delivered_at: -1 })
          .toArray();

        res.send({
          success: true,
          data: deliveries,
        });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .send({ message: "Failed to fetch completed deliveries" });
      }
    });

    app.get("/riders/earnings-summary", verifyFBToken, async (req, res) => {
      try {
        const email = req.tokenEmail;
        const rider = await ridersCollection.findOne({ email });
        if (!rider) {
          return res.status(404).send({ message: "Rider not found" });
        }

        const deliveries = await parcelCollection
          .find({
            rider_id: rider._id.toString(),
            delivery_status: {
              $in: ["delivered", "delivered-to-service-center"],
            },
          })
          .toArray();


        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        let total = 0;
        let cashedOut = 0;
        let pending = 0;
        let weekly = 0;
        let monthly = 0;
        let yearly = 0;

        deliveries.forEach((d) => {
          const earning = d.earning || 0;
          const deliveredAt = new Date(d.delivered_at);
          total += earning;
          if (d.cashout_status === "cashed_out") {
            cashedOut += earning;
          } else {
            pending += earning;
          }

          if (deliveredAt >= startOfWeek) weekly += earning;
          if (deliveredAt >= startOfMonth) monthly += earning;
          if (deliveredAt >= startOfYear) yearly += earning;
        });
        res.send({
          total,
          cashedOut,
          pending,
          weekly,
          monthly,
          yearly,
        });
      } catch (error) {
        res.status(500).send({ message: "Failed to load earnings summary" });
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

      const user = await userCollection.findOne({ email: req.tokenEmail });

      if (user?.role !== "user") {
        return res
          .status(403)
          .send({ message: "Only regular users can apply to be riders." });
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
      const { status } = req.body;
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).send({ message: "Invalid status" });
      }
      const rider = await ridersCollection.findOne({ _id: new ObjectId(id) });

      if (!rider) {
        return res.status(404).send({ message: "Rider not found" });
      }
      if (rider.status !== "pending") {
        return res.status(409).send({ message: "Rider already reviewed" });
      }
      const result = await ridersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, reviewedAt: new Date() } },
      );
      if (status === "approved") {
        await userCollection.updateOne(
          { email: rider.email },
          { $set: { role: "rider" } },
        );
      }

      if (status === "rejected") {
        await userCollection.updateOne(
          { email: rider.email },
          { $set: { role: "user" } },
        );
      }

      res.send(result);
    });

    app.patch(
      "/riders/:id/deactivate",
      verifyFBToken,
      verifyAdmin,
      async (req, res) => {
        const { id } = req.params;
        const riderEntry = await ridersCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!riderEntry) {
          return res.status(404).send({ message: "Rider record not found" });
        }
        const riderEmail = riderEntry.email;
        try {
          const riderUpdate = await ridersCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "inactive",
                reviewedAt: new Date(),
              },
            },
          );

          const userUpdate = await userCollection.updateOne(
            { email: riderEmail },
            { $set: { role: "user" } },
          );
          res.send({
            message: "Rider deactivated and role reverted successfully",
            riderUpdate,
            userUpdate,
          });
        } catch (err) {
          res
            .status(500)
            .send({ message: "Deactivation Failed", error: err?.message });
        }

        res.send(result);
      },
    );

    /* RIDERS APIS */

    /* Parcel APIs */

    app.get("/parcels", async (req, res) => {
      try {
        const { payment_status, delivery_status, email } = req.query;
        let query = {};
        if (email) {
          query = { created_by: email };
        }

        if (payment_status) {
          query.payment_status = payment_status;
        }
        if (delivery_status) {
          query.delivery_status = delivery_status;
        }

        const options = { sort: { creation_date: -1 } };
        const parcels = await parcelCollection.find(query, options).toArray();
        res.send(parcels);
      } catch {
     
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
      
        if (frontendCost !== actualCost.total) {
          return res.status(400).json({
            message: "Parcel cost mismatch. Please refresh and try again.",
          });
        }
        await logTracking(
          trackingId,
          "Created",
          "Parcel created and ready for pickup",
          senderRegion,
        );
        res.status(201).send(await parcelCollection.insertOne(req?.body));
      } catch (err) {
        res.status(500).send({ message: "Failed to create parcel" });
      }
    });

    app.patch("/parcels/:id/assign-rider", async (req, res) => {
      const { id } = req.params;
      const { riderId } = req.body;
      if (!riderId) {
        return res.status(400).send({ message: "Rider ID required" });
      }

      const rider = await ridersCollection.findOne({
        _id: new ObjectId(riderId),
      });

      if (!rider) {
        return res.status(404).send({ message: "Rider not available" });
      }
      const parcel = await parcelCollection.findOne({ _id: new ObjectId(id) });
      if (!parcel) {
        return res.status(404).send({ message: "Parcel not found" });
      }
      const parcelUpdate = await parcelCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            delivery_status: "assigned",
            rider_id: riderId,
            rider_name: rider.name,
            rider_phone: rider.phone,
            assigned_at: new Date(),
          },
        },
      );

      await logTracking(
        parcel.trackingId,
        "Assigned",
        `Rider ${rider.name} is on the way`,
        rider.district,
      );
      res.send({
        message: "Rider assigned and tracking updated",
        parcelUpdate,
      });
    });

    /* Patch when pickup */
    app.patch("/parcels/:id/pickup", verifyFBToken, async (req, res) => {
      const { id } = req.params;
      const rider = await ridersCollection.findOne({
        email: req.tokenEmail,
        status: "approved",
      });
      if (!rider)
        return res.status(403).send({ message: "Rider not authorized" });

      const parcel = await parcelCollection.findOne({ _id: new ObjectId(id) });
      if (!parcel) return res.status(404).send({ message: "Parcel not found" });
      if (
        parcel.delivery_status !== "assigned" ||
        parcel.rider_id !== rider._id.toString()
      ) {
        return res.status(409).send({ message: "Invalid pickup attempt" });
      }
      await parcelCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            delivery_status: "in-transit",
            picked_up_at: new Date(),
          },
        },
      );
      await logTracking(
        parcel.trackingId,
        "In Transit",
        "Parcel picked up by rider",
        parcel.senderServiceCenter,
      );

      res.send({ message: "Parcel picked up successfully" });
    });

    /* Patch when delivered */
    app.patch("/parcels/:id/deliver", verifyFBToken, async (req, res) => {
      const { id } = req.params;

      const rider = await ridersCollection.findOne({
        email: req.tokenEmail,
        status: "approved",
      });
      if (!rider)
        return res.status(403).send({ message: "Rider not authorized" });

      const parcel = await parcelCollection.findOne({ _id: new ObjectId(id) });
      if (!parcel) return res.status(404).send({ message: "Parcel not found" });

      if (
        parcel.delivery_status !== "in-transit" ||
        parcel.rider_id !== rider._id.toString()
      ) {
        return res.status(409).send({ message: "Invalid delivery attempt" });
      }

      const sameDistrict =
        parcel.senderServiceCenter === parcel.receiverServiceCenter;

      const earningRate = sameDistrict ? 0.8 : 0.3;
      const earning = Math.round(parcel.cost * earningRate);

      await parcelCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            delivery_status: "delivered",
            delivered_at: new Date(),
            earning,
            earning_rate: earningRate,
            delivery_type: sameDistrict ? "Same District" : "Inter District",
            cashout_status: "unpaid",
          },
        },
      );

      await logTracking(
        parcel.trackingId,
        "Delivered",
        "Parcel successfully delivered",
        parcel.receiverServiceCenter,
      );

      res.send({ message: "Parcel delivered successfully" });
    });

    /* Cashout update */
    app.patch("/parcels/:id/cashout", verifyFBToken, async (req, res) => {
      try {
        const parcelId = req.params.id;
        const email = req.tokenEmail;

        const rider = await ridersCollection.findOne({ email });
        if (!rider) {
          return res.status(403).send({
            success: false,
            message: "Unauthorized rider",
          });
        }

        const parcel = await parcelCollection.findOne({
          _id: new ObjectId(parcelId),
          rider_id: rider._id.toString(),
        });

        if (!parcel) {
          return res.status(404).send({
            success: false,
            message: "Parcel not found or not assigned to you",
          });
        }

        if (
          !["delivered", "delivered-to-service-center"].includes(
            parcel.delivery_status,
          )
        ) {
          return res.status(400).send({
            success: false,
            message: "Parcel is not completed yet",
          });
        }

        if (parcel.cashout_status === "cashed_out") {
          return res.status(400).send({
            success: false,
            message: "Already cashed out",
          });
        }

        const result = await parcelCollection.updateOne(
          { _id: new ObjectId(parcelId) },
          {
            $set: {
              cashout_status: "cashed_out",
              cashed_out_at: new Date(),
            },
          },
        );

        res.send({
          success: true,
          message: "Cashout successful",
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "Cashout failed",
        });
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
      verifyAuthorizeEmail("query"),
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

      const parcel = await parcelCollection.findOne({
        _id: new ObjectId(parcelId),
      });
      if (!parcel) return res.status(404).send({ message: "Parcel not found" });

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
      await logTracking(
        parcel.trackingId,
        "Paid",
        "Payment confirmed via Stripe",
        "Online",
      );
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
