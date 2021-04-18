const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

const uri = "mongodb+srv://completeWebsite11:jjitXdzysSFAmOgG@cluster0.dfncg.mongodb.net/refitCompleteWebsite11?retryWrites=true&w=majority";
// console.log(uri)

const app = express();

app.use(bodyParser.json())
app.use(cors())

const port = 5000;

app.get('/', (req, res) => {
    res.send("mongodb working")
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("refitCompleteWebsite11").collection("addServices");
    const commentsCollection = client.db("refitCompleteWebsite11").collection("customerComments");
    const ordersCollection = client.db("refitCompleteWebsite11").collection("orders");
    const adminsCollection = client.db("refitCompleteWebsite11").collection("admins");

    // Get the data form addservices(Admin)
    app.post('/addServices', (req, res) => {
        const serviceData = req.body;
        console.log(serviceData);
        servicesCollection.insertOne(serviceData)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // Read the data from database for our services area
    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, items) => {
                res.send(items);
            })
    })

    // Get the data form review(User)
    app.post('/addComments', (req, res) => {
        const customerComment = req.body;
        commentsCollection.insertOne(customerComment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/customerComment', (req, res) => {
        commentsCollection.find({})
            .toArray((err, items) => {
                res.send(items)
            })
    })

    // placed orders from the book(User)
    app.post('/addOrders', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    // loaded specific user order form database
    app.get('/userOrders', (req, res) => {
        ordersCollection.find({ userEmail: req.query.email })
            .toArray((err, items) => {
                res.send(items);
            })
    })


    // loaded all orders form database
    app.get('/allOrders', (req, res) => {
        ordersCollection.find({})
            .toArray((err, itmes) => {
                res.send(itmes)
            })
    })

    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminsCollection.insertOne(admin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.find({ adminEmail: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0)
            })
    })


    app.post('/deleteService', (req, res) => {
        const id = req.body.id
        servicesCollection.deleteOne({ _id: ObjectID(id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

});

app.listen(process.env.PORT || port)