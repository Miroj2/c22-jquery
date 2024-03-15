var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');


module.exports = function (db) {
  const collection = db.collection('challenges')
  router.get('/', async function (req, res, next) {
    try {
      const findResult = await collection.find({}).toArray();
      // console.log('found documents =>', findResult);

      let searchNumber = req.query.searchnumber;
      const searchString = req.query.searchstring;
      let searchInteger = req.query.searchinteger;
      let searchFloat = req.query.searchfloat;
      const searchDateFrom = req.query.searchdatefrom;
      const searchDateTo = req.query.searchdateto;
      const searchBoolean = req.query.searchboolean;
      const page = parseInt(req.query.page) || 1;
      const sortBy = req.query.sortBy;
      const sortMode = req.query.sortMode;
      const limit = 3;
      const offset = (page - 1) * limit;

      if (searchNumber) {
        searchNumber = parseInt(searchNumber)
      }
      if (searchInteger) {
        searchInteger = parseInt(searchInteger)
      }
      if (searchFloat) {
        searchFloat = parseFloat(searchFloat)
      }

      let results = findResult
      results.forEach((element, i) => {
        element.number = i + 1
      });

      if (sortMode === 'asc') {
        if (sortBy === 'integer') {
          results.sort(function (a, b) {
            return a[sortBy] - b[sortBy]
          })
        }
        else if (sortBy === 'string') {
          results.sort(function (a, b) {
            if (a[sortBy] < b[sortBy]) {
              return 1
            } else if (a[sortBy] > b[sortBy]) {
              return -1
            } else return 0
          })
        }
        else if (sortBy === 'number') {
          results.sort(function (a, b) {
            return a[sortBy] - b[sortBy]
          })
        }
        else if (sortBy === 'float') {
          results.sort(function (a, b) {
            return a[sortBy] - b[sortBy]
          })
        }
        else if (sortBy === 'date') {
          results.sort(function (a, b) {
            if (a[sortBy] < b[sortBy]) {
              return 1
            } else if (a[sortBy] > b[sortBy]) {
              return -1
            } else return 0
          })
        }
        else if (sortBy === 'boolean') {
          results.sort(function (a, b) {
            if (a[sortBy] > b[sortBy]) {
              return 1
            } else if (a[sortBy] < b[sortBy]) {
              return -1
            } else return 0
          })
        }
      }
      else {
        if (sortBy === 'integer') {
          results.sort(function (a, b) {
            return b[sortBy] - a[sortBy]
          })
        }
        else if (sortBy === 'string') {
          results.sort(function (a, b) {
            if (a[sortBy] > b[sortBy]) {
              return 1
            } else if (a[sortBy] < b[sortBy]) {
              return -1
            } else return 0
          })
        }
        else if (sortBy === 'number') {
          results.sort(function (a, b) {
            return b[sortBy] - a[sortBy]
          })
        }
        else if (sortBy === 'float') {
          results.sort(function (a, b) {
            return b[sortBy] - a[sortBy]
          })
        }
        else if (sortBy === 'date') {
          results.sort(function (a, b) {
            if (a[sortBy] > b[sortBy]) {
              return 1
            } else if (a[sortBy] < b[sortBy]) {
              return -1
            } else return 0
          })
        }
        else if (sortBy === 'boolean') {
          results.sort(function (a, b) {
            if (a[sortBy] < b[sortBy]) {
              return 1
            } else if (a[sortBy] > b[sortBy]) {
              return -1
            } else return 0
          })
        }
      }

      if (searchNumber) {
        results = results.filter(obj => {
          return obj.number === searchNumber
        })
      }
      if (searchString) {
        results = results.filter(obj => {
          return obj.string === searchString
        })
      }
      if (searchInteger) {
        results = results.filter(obj => {
          return obj.integer === searchInteger
        })
      }
      if (searchFloat) {
        results = results.filter(obj => {
          return obj.float === searchFloat
        })
      }
      if (searchDateFrom && searchDateTo) {
        results = results.filter((item) => {
          return item.date >= searchDateFrom &&
            item.date <= searchDateTo;
        });
      }
      if (req.query.searchboolean === 'none') {
        results = results.filter(obj => {
          return results
        })
      }
      if (req.query.searchboolean === 'true') {
        results = results.filter(obj => {
          return obj.boolean === searchBoolean
        })
      }
      if (req.query.searchboolean === 'false') {
        results = results.filter(obj => {
          return obj.boolean === searchBoolean
        })
      }

      const totalPage = Math.ceil(results.length / limit)
      results = results.slice(offset, offset + limit)
      res.json({ results, page, totalPage, sortMode, sortBy, searchNumber, searchString, searchInteger, searchFloat, searchDateFrom, searchDateTo, searchBoolean })
    }
    catch (err) {
      console.log(err)
    }
  });
  router.post('/', async function (req, res, next) {
    try {
      const insertResult = await collection.insertOne({ string: req.body.string, integer: parseInt(req.body.integer), float: parseFloat(req.body.float), date: req.body.date, boolean: req.body.boolean })
      console.log('inserted documents =>', insertResult);
      const user = await collection.findOne({ _id: insertResult.insertedId })
      res.redirect('/')
    }
    catch (err) {
      console.log(err)
    }
  });
  router.delete('/:id', async function (req, res, next) {
    try {
      const user = await collection.findOne({ _id: new ObjectId(req.params.id) })
      const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
      console.log('Deleted documents =>', deleteResult);
      res.redirect('/')
    }
    catch (err) {
      console.log(err)
    }
  });
  router.get('/:id', async function (req, res, next) {
    try {
      const findResult = await collection.find({ _id: new ObjectId(req.params.id) }).toArray();
      console.log('found documents =>', findResult);
      const editData = findResult[0]
      res.json(editData)
    }
    catch (err) {
      console.log(err)
    }
  });
  router.patch('/:id', async function (req, res, next) {
    try {
      const updateResult = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { string: req.body.string, integer: parseInt(req.body.integer), float: parseFloat(req.body.float), date: req.body.date, boolean: req.body.boolean } });
      const user = await collection.findOne({ _id: new ObjectId(req.params.id) })
      console.log('Updated documents =>', user);
      res.redirect('/')
    }
    catch (err) {
      console.log(err)
    }
  });
  return router
}