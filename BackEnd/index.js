const express = require('express')
const app = express()
const cors = require('cors')

// realiza a inicialização do framework para a construção do backend
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// lida com os problemas de cors para requisições http
app.use(cors())

// escuta a porta 3000 do localhost para iniciar o servidor
app.listen(3000, () => {
  console.log('Backend rodando.')
})

// criação da rota cities, que retorna as cidades do csv
app.get('/cities', async (req, res, next) => {
  var utils = require('./utils')
  try {
    let cities = await utils.getCities()
    res.json(cities)
  } catch (err) {
    res.status(500).json(err)
  }
})

// criação da rota trucks, que retorna os tipos existentes de caminhão
app.get('/trucks', async (req, res, next) => {
  try {
    let trucks = ['PEQUENO', 'MÉDIO', 'GRANDE']
    res.json(trucks)
  } catch (err) {
    res.status(500).json(err)
  }
})

// criação da rota distance, que retorna a distância entre duas cidades e o preço baseado no caminhão escolhido
app.get('/distance', async (req, res, next) => {
  var utils = require('./utils')
  try {
    let { from, to, truck } = req.query
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

// criação da rota bestTrucks, que retorna um objeto com diversas informações, sendo a mais importante delas o preço por rota, além de quantos caminhões de cada tipo serão utilizados
app.post('/bestTrucks', async (req, res, next) => {
  let itinerary = req.body
  console.log(req.body)
  const truckSorter = require('./truckSorter')
  try {
    // a otimização dos preços e caminhões é feita na função abaixo
    let config = await truckSorter.getBestTruckConfiguration(itinerary)

    // realiza o armazenamento do transporte cadastrado para poder ser enviado posteriormente em outra rota para o relatório
    const { saveTransportation } = require('./storage')
    saveTransportation(config)
    res.json(config)
  } catch (err) {
    res.status(500).json(err)
  }
})

// rota para retorno das informações de todos transportes já cadastrados salvos em memória
app.get('/transportation', async (req, res, next) => {
  try {
    const { getAllTransportation } = require('./storage')
    res.json(getAllTransportation())
  } catch (err) {
    res.status(500).json(err)
  }
})
