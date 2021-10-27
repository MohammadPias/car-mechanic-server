const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4muq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("carMechanic");
        const serviceCollection = database.collection("services");

        //Get Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query)
            res.json(service)
        })

        // Get Api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();

            res.send(services);
        })

        //Post Api
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)

            res.json(result)
        });

        // Delete service
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('hit the id', id)
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {

    }
};
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Welcome to Car Mechanic Server')
});

app.listen(port, () => {
    console.log('Listening Car Mechanic Server Port', port);
});