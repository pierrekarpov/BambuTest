var csv = require("fast-csv");
var express = require('express')
var app = express()


var data_shape = {
  "name": {
    "index": 0,
    "type": 'string'
  },
  "age": {
    "index": 1,
    "type": 'number'
  },
  "latitude": {
    "index": 2,
    "type": 'number'
  },
  "longitude": {
    "index": 3,
    "type": 'number'
  },
  "monthlyIncome": {
    "index": 4,
    "type": 'number'
  },
  "experienced": {
    "index": 5,
    "type": 'boolean'
  }
}

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/people-like-you', function (req, res) {
  let q = req.query
  const { name, age, latitude, longitude, monthlyIncome, experienced } = q

  var vals = []
  var idx = []
  for (var k in data_shape) {
    if (q[k] != undefined) {
      if (k == "experienced") {
        vals.push(q[k] == "true" ? 1 : 0)
      } else {
        vals.push(q[k])
      }

      idx.push(data_shape[k].index)
    }
  }

  var distances = []
  csv
    .fromPath("data/data.csv")
    .on("data", function(data) {
      var d = 0.0
      for (var i in idx) {
        if (data[idx[i]] == "true") {
          data[idx[i]] = 1
        } else if (data[idx[i]] == "false") {
          data[idx[i]] = 0
        }
        d = d + (data[idx[i]] - vals[i]) * (data[idx[i]] - vals[i])
      }

      d = Math.sqrt(d)
      distances.push([d, data])
    })
    .on("end", function() {
      distances.sort(function(a, b){
        return a[0] - b[0]
      })
      let min = distances[1][0]
      let max = distances[distances.length - 1][0]

      for (var d in distances) {
        distances[d][0] = 1 - (distances[d][0] - min) / (max - min)
      }

      ress = []
      for (var i = 1; i < 11; i++) {
        let d = distances[i][1]
        ress.push({
          "name": d[data_shape["name"]["index"]],
          "age": d[data_shape["age"]["index"]],
          "latitude": d[data_shape["latitude"]["index"]],
          "longitude": d[data_shape["longitude"]["index"]],
          "monthlyIncome": d[data_shape["monthlyIncome"]["index"]],
          "experienced": d[data_shape["experienced"]["index"]],
          "score": distances[i][0],
        })
      }
      res.json({ "peopleLikeYou": ress });
    });
})

app.listen(process.env.PORT || 5000, function () {
  console.log('App listening on port 5000!')
})

module.exports = app;
