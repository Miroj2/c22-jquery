var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

module.exports = function (db) {
  const collection = db.collection('challenges')
  router.get('/', async function (req, res, next) {
    const searchNumber = parseInt(req.query.searchnumber);
    res.render('index')
  });
  return router
}