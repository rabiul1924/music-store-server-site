const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const port = process.env.PORT || 5000



const app = express()
app.use(express.urlencoded({ extended: false }));
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
  const productCollectionForOrder = client.db("music").collection("orders");

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

  app.get("/book/:_id", (req, res) => {
    console.log(req.params._id);
    productCollection.find({ _id: ObjectId(req.params._id) })

        .toArray((err, documents) => {
            res.send(documents[0]);
        });
});


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


app.post("/addOrders", (req, res) => {
  const newOrder = req.body;
  productCollectionForOrder.insertOne(newOrder).then((result) => {
      res.send(result.insertedCount > 0);
  });
});

app.get("/order", (req, res) => {
  productCollectionForOrder.find().toArray((err, items) => {
      res.send(items);
  });     
});

app.delete('/delete/:_id',(req,res) => {
  productCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then((result) => {
      res.send(result.deletedCount>0);
  })
});



 
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  process.env.PORT || port
})