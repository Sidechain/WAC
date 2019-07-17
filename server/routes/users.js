const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
// const getCollection = require('mongodb').getCollection;

router.post('/', function (req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    const dbo = db.db('mongo-mob');
    const user = req.body;
    dbo.collection('users').findOne({id: user.id}, function (err, result) {
      if (err) throw err;
      if (!result) {
        console.log("I am actually here also")
        dbo.collection('users').insertOne(user, function (err, result) {
          if (err) throw err;
          res.send("Object added to database");
          db.close();
        });
      }
      console.log("Nothing happened")
      db.close();
    });  
  });
});


/* GET users listing. */
// router.get('/', function (req, res, next) {
//   MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
//     if (err) throw err;
//     const dbo = db.db('mongo-mob');
//     dbo.collection("post").find().toArray(function (err, result) {
//       if (err) throw err;
//       res.send(result);
//       db.close();
//     });
//   });
// });

module.exports = router;
