const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
var ObjectId = require('mongodb').ObjectId;

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
  const productCollectionForAdmin = client.db("music").collection("admins");

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

// app.delete('/delete/:_id',(req,res) => {
//   productCollectionForOrder.findOneAndDelete({_id:ObjectId(req.params.id)})
//   .then((result) => {
//       res.send(result.deletedCount>0);
//   })
// });
app.delete("/delete/:id", (req, res) => {
  // const id = req.params.id;
  // productCollectionForOrder
  //   .findOneAndDelete({ _id: id })
  //   .then((deletedDocument) => {
  //     if (deletedDocument) {
  //       console.log("deleted");
  //     } else console.log("not deleted");
  //     return deletedDocument;
  //   })
  //   .catch((err) => console.log("failed to find"));
  // console.log(id)



  const id =ObjectId((req.params.id));
  productCollectionForOrder.findOneAndDelete({_id:id})
    .then(documents=> {
      res.send(!!documents.value);
      console.log("Service deleted successfully");
    })
});

//admin
app.post("/addAdmin", (req, res) => {
  const newAdmin = req.body;
  console.log("new admin", newAdmin);

  productCollectionForAdmin.insertOne(newAdmin).then((result) => {
    res.send(result.insertedCount > 0);
  });
});

app.post("/isAdmin", (req, res) => {
  const email = req.body.email;

  productCollectionForAdmin.find({ email: email }).toArray((err, admins) => {
    res.send(admins.length > 0);
  });
});

//case
app.get("/cases", (req, res) => {
  productCollectionForOrder.find({ email: req.query.email }).toArray((err, document) => {
    res.send(document);
  });
})



 
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  process.env.PORT || port
})