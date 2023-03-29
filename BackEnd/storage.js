const { v4: uuidv4 } = require('uuid')

// criação do array que armazenará as informações dos transportes cadastrados
let transportationDatabase = []

// salvar o transporte cadastrado, com id e cada trecho separado
const saveTransportation = section => {
  const id = uuidv4()
  transportationDatabase.push({ id, section })
}

// retorna todos transportes armazenados
const getAllTransportation = () => {
  return transportationDatabase
}

// exporta essas funções para serem usadas em outro arquivo
exports.saveTransportation = saveTransportation
exports.getAllTransportation = getAllTransportation
