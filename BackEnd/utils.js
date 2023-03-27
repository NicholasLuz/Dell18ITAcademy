const csvParser = require('csv-parser')
const fs = require('fs')

var readFile = () =>
  new Promise((resolve, reject) => {
    let result = []
    let header = []
    fs.createReadStream('distancias.csv', { encoding: 'utf-8' })
      .pipe(csvParser({ separator: ';', fromLine: 1 }))
      .on('headers', headers => {
        header = headers
      })
      .on('data', data => {
        result.push(data)
      })
      .on('end', () => {
        resolve({ cities: header, distances: result })
      })
      .on('error', error => {
        reject(error)
      })
  })

var getCities = async () => {
  try {
    let file = await readFile()
    return file.cities
  } catch (error) {
    return error
  }
}

const getDistanceBetween = async (from, to) => {
  try {
    let file = await readFile()
    let cityIndex = file.cities.findIndex(city => city == from)
    let cityDistancesArray = file.distances[cityIndex]
    let distanceTo = cityDistancesArray[to]
    return distanceTo
  } catch (error) {
    return error
  }
}

const getInfo = async (from, to, truck) => {
  let distance = await getDistanceBetween(from, to)
  console.log(distance)
  let pricePerTruck = getPriceForTruck(truck)
  let price = distance * pricePerTruck
  return { distance, price }
}

const getPriceForTruck = truck => {
  console.log(truck)
  switch (truck) {
    case 'PEQUENO':
      return 4.87
    case 'MÉDIO':
      return 11.92
    case 'GRANDE':
      return 27.44
    default:
      return 0
  }
}

exports.getCities = getCities
exports.getInfo = getInfo
