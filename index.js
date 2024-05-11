const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


//Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Ideal library server is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cd4uzfy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Send a ping to confirm a successful connection
        const bookCollection = client.db("BooksDB").collection("books");



        app.post('/addBook', async (req, res) => {
            const book = req.body
            const result = await bookCollection.insertOne(book)
            res.send(result)
        })

        app.get('/allBook', async (req, res) => {
            const result = await bookCollection.find().toArray()
            res.send(result)
        })

        //gategory data
        app.get('/romantic', async (req, res) => {
            const query = { category: 'romantic' }
            const result = await bookCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/history', async (req, res) => {
            const query = { category: 'history' }
            const result = await bookCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/religion', async (req, res) => {
            const query = { category: 'religion' }
            const result = await bookCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/kids', async (req, res) => {
            const query = { category: 'kids' }
            const result = await bookCollection.find(query).toArray()
            res.send(result)
        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);


//Port Define
app.listen(port, () => {
    console.log(`The server running Port: ${port}`);
})