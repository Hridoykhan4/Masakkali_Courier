require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@happiness-hill.1es2bek.mongodb.net/?appName=Happiness-Hill`;
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//Middleware
// app.use(
//   cors({
//     origin: [
//       "https://9jnv16dr-5000.asse.devtunnels.ms",
//       "http://localhost:5173",
//     ],
//   })
// );
app.use(cors())
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

app.listen(port, "0.0.0.0", () => {
  console.log(`Bistro is running on PORT: ${port}`);
});
