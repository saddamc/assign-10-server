const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m0qpfuk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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
    // await client.connect();


    const productCollection = client.db('productDB').collection('product');
    // user 
    const userCollection = client.db('productDB').collection('user');
    
    app.get('/product', async(req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.post('/product', async(req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    })
    // update product put 2 
    app.put('/product/:id', async(req, res) => {
      const id = req.params.id;
      const filter ={_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name,
          email: updatedProduct.email,
          productname: updatedProduct.productname,
          time: updatedProduct.time,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          category: updatedProduct.category,
          image: updatedProduct.image,
          customization: updatedProduct.customization,
          stock: updatedProduct.stock,
          details: updatedProduct.details,
          gender: updatedProduct.gender,
        }
      }
      const result = await productCollection.updateOne(filter, product, options)
      res.send(result);
    })

    // update product 1 for id
    app.get('/product/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);      
    })
    

    app.delete('/product/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    // user related apis
    app.get('/user', async(req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    })

    app.post('/user', async(req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.delete('/user/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
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
    res.send('Crafts Server is running')
})



app.listen(port, () => {
    console.log(`Harbor Crafts Server is running on port: ${port}`)
})

