const express = require('express');
const cors = require('cors');

require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());






const uri = "mongodb+srv://saifulislamr16:vgfAmVCqo9RD3qly@cluster0.x6dxxop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const db = client.db("allTickets");
    const passCollection = db.collection("tickets");
    const mrtCollection = db.collection("mrt");
    const noticesCollection = db.collection("notices");

    app.post('/bookTicket', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await passCollection.insertOne(booking);
      res.send(result);
    });


    app.post('/check', async (req, res) => {
      const mrt_reg = req.body;
      const existingDocument = await mrtCollection.findOne({ no: mrt_reg.nid });
      if(existingDocument)
        res.send({ exist: true });
      else
        res.send({ exist: false });
    })

    app.post('/postMrt', async (req, res) => {
      const mrt_reg = req.body;
      console.log(mrt_reg);
      const result = await mrtCollection.insertOne(mrt_reg);
      res.send(result)

    });

    app.post('/postNotice', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await noticesCollection.insertOne(booking);
      res.send(result);
    });

    app.get('/bookings', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
        const result = await mrtCollection.find(query).toArray();
        return res.send(result);
      }
      res.send([])
    })


    app.get('/tickets', async (req, res) => {
      const cursor = passCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/getNotice', async (req, res) => {
      const cursor = noticesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});