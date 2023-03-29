const csvParser = require('csv-parser')
const fs = require('fs')

// função para realizar a leitura do arquivo csv, utilizando uma biblioteca específica
const readFile = () =>
  new Promise((resolve, reject) => {
    let result = []
    let header = []
    fs.createReadStream('distancias.csv', { encoding: 'utf-8' })
      .pipe(csvParser({ separator: ';', fromLine: 1 }))
      // separando o header(cidades) em um array
      .on('headers', headers => {
        header = headers
      })
      // e o restante das linhas aloca em um array, sendo cada posição do array um objeto contendo a distância da cidade de cada índice até a cidade definida no objeto
      .on('data', data => {
        result.push(data)
      })
      .on('end', () => {
        // retorna um objeto com cidades e distancias
        resolve({ cities: header, distances: result })
      })
      .on('error', error => {
        reject(error)
      })
  })

// função que retorna apenas as cidades
const getCities = async () => {
  try {
    // busca na função acima e retorna apenas as cidades do objeto
    let file = await readFile()
    return file.cities
  } catch (error) {
    return error
  }
}

// função chamada para verificar a distância entre duas cidades selecionadas
const getDistanceBetweenCities = (from, to, cities, distances) => {
  try {
    // busca no array de cidades a cidade com mesmo nome, retornando o índice
    let cityIndex = cities.findIndex(city => city == from)
    // busca no array de distâncias apenas o elemento cujo índice é o da cidade de origem
    let cityDistancesArray = distances[cityIndex]
    // por fim busca apenas o elemento que possui o nome da cidade de destino
    let distanceTo = cityDistancesArray[to]
    return distanceTo
  } catch (error) {
    return error
  }
}

// função para retornar informação de distância e preço para uma rota e tipo de caminhão requisitados
const getInfo = async (from, to, truck) => {
  let { cities, distances } = await readFile()
  // chama a função que calcula as distâncias passando as cidades requisitadas
  let distance = await getDistanceBetweenCities(from, to, cities, distances)
  // busca o preço por quilômetro do caminhão especificado
  let pricePerTruck = getPriceForTruck(truck)
  // realiza a multiplicação da distância pelo preço, retornando-a
  let price = distance * pricePerTruck
  return { distance, price }
}

// função que apenas retorna o preço por quilômetro de cada tipo de caminhão
const getPriceForTruck = truck => {
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

// função que retorna o peso em quilos que cada tipo de caminhão suporta
const getWeightPerTruck = truck => {
  switch (truck) {
    case 'PEQUENO':
      return 1000
    case 'MÉDIO':
      return 4000
    case 'GRANDE':
      return 10000
    default:
      return 0
  }
}

// exporta todas essas funções para poderem ser utilizadas nos outros arquivos
exports.getCities = getCities
exports.getInfo = getInfo
exports.readFile = readFile
exports.getDistanceBetweenCities = getDistanceBetweenCities
exports.getPriceForTruck = getPriceForTruck
exports.getWeightPerTruck = getWeightPerTruck
