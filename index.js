const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
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
        servicesCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.post('/addComments', (req, res) => {
        const customerComment = req.body;
        console.log(customerComment);
        commentsCollection.insertOne(customerComment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
});

app.listen(process.env.PORT || port)