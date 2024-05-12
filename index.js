const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const borrowCollection = client.db("BooksDB").collection("borrows");



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

        //details data load
        app.get('/book/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bookCollection.findOne(query)
            res.send(result)
        })

        //borrow handle
        app.post('/bookDetails/:id', async (req, res) => {
            const id = req.params.id
            const borrow = req.body
            const result = bookCollection.updateMany({ _id: new ObjectId(id) }, { $inc: { quantity: -1 } })
            const value = await borrowCollection.insertOne(borrow)
            res.send(value)
        })
        //borrow data load
        app.get('/borrow', async (req, res) => {
            const result = await borrowCollection.find().toArray()
            res.send(result)
        })

        //return and delete
        app.delete('/return/:id', async (req, res) => {
            const id = req.params.id
            const value = bookCollection.updateMany({ _id: new ObjectId(id) }, { $inc: { quantity: 1 } })
            const filter = { _id: new ObjectId(id) }
            const result = await borrowCollection.deleteOne(filter)
            res.send(result)
        })
        //My book
        app.get('/mybook/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await bookCollection.find(query).toArray()
            res.send(result)
        })
        //update book
        app.get('/update/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bookCollection.findOne(query)
            res.send(result)
        })

        app.patch('/updatebook/:id', async (req, res) => {
            const id = req.params.id
            const updatebook = req.body
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    bookName: updatebook.bookName,
                    quantity: updatebook.quantity,
                    authorName: updatebook.authorName,
                    category: updatebook.category,
                    rating: updatebook.rating,
                    photo: updatebook.photo,
                    description: updatebook.description,
                    about: updatebook.about
                },
            };
            const result = await bookCollection.updateOne(filter, updateDoc, options)
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