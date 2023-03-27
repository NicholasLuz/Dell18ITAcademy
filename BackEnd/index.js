var express = require('express')
var app = express()

app.listen(3000, () => {
  console.log('Backend rodando.')
})

app.get('/getCities', async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  var utils = require('./utils')
  try {
    let cities = await utils.getCities()
    res.json(cities)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get('/getTrucks', async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  try {
    let trucks = ['PEQUENO', 'MÉDIO', 'GRANDE']
    res.json(trucks)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get('/getInfo', async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  var utils = require('./utils')
  try {
    let { from, to, truck } = req.query
    console.log(req.query)
    let info = await utils.getInfo(
      from.toUpperCase(),
      to.toUpperCase(),
      truck.toUpperCase()
    )
    res.json(info)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get('/checkParts', (req, res, next) => {
  var utils = require('./utils')
  utils.parseCities
    .then(value => {
      res.json(value.cities)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})
