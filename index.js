const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
const port = process.env.PORT || 5000



const app = express()
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y5f6g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("music").collection("book");
  const productCollectionForReviews = client.db("music").collection("reviews");

  app.get("/book", (req, res) => {
    productCollection.find().toArray((err, items) => {
        res.send(items);
    });
});
 
  app.post('/addService', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product', newProduct);
    productCollection.insertOne(newProduct)
    .then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
  });
  })


  app.get("/reviews", (req, res) => {
    productCollectionForReviews.find().toArray((err, review) => {
        res.send(review);
    });
});

app.post('/comment', (req, res) => {
  const newReviews = req.body;
  console.log('adding new reviews', newReviews);
  productCollectionForReviews.insertOne(newReviews)
  .then((result) => {
    console.log("inserted count", result.insertedCount);
    res.send(result.insertedCount > 0);
});
})


 
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})