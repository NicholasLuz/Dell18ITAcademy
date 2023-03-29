const utils = require('./utils')

// função para retornar a melhor configuração de caminhões para o transporte cadastrado
const getBestTruckConfiguration = async itinerary => {
  try {
    let { cities, distances } = await utils.readFile()
    let routes = itinerary.map(route => ({
      distance: utils.getDistanceBetweenCities(
        route.source,
        route.destination,
        cities,
        distances
      ),
      items: route.items,
      source: route.source,
      destination: route.destination
    }))
    // optei por realizar a melhor configuração por rota, ou seja, decidi considerar que cada rota nova do transporte seria independente da anterior
    let configs = routes.map(route => ({
      ...getBestTruckConfigurationForRoute(route),
      ...route
    }))

    let itemWeights = {}

    routes.forEach(route => {
      route.items.forEach(item => {
        if (itemWeights[item.name]) {
          itemWeights[item.name] += item.weight * item.amount
        } else {
          itemWeights[item.name] = item.weight * item.amount
        }
      })
    })

    // pega-se o preço para cada caminhão nessa configuração
    configs.forEach(config => {
      config.smallTruckPrice =
        config.smallTrucks.length *
        config.distance *
        utils.getPriceForTruck('PEQUENO')
      config.mediumTruckPrice =
        config.mediumTrucks.length *
        config.distance *
        utils.getPriceForTruck('MÉDIO')
      config.bigTruckPrice =
        config.bigTrucks.length *
        config.distance *
        utils.getPriceForTruck('GRANDE')

      // o preço total por rota
      config.totalCost =
        config.smallTruckPrice + config.mediumTruckPrice + config.bigTruckPrice

      // a quantidade de itens total por rota
      config.totalItems = config.items
        .map(item => item.amount)
        .reduce((acc, current) => acc + current, 0)

      // o preço unitário por rota
      config.unitaryCost = config.totalCost / config.totalItems

      // o peso total da carga por rota
      config.totalWeight = config.items.reduce(
        (acc, currentValue) => acc + currentValue.amount * currentValue.weight,
        0
      )
    })

    // para cada rota constrói-se o retorno com preços por caminhão, quantidade de caminhões, distância, origem, destino,
    // preço total, quantidade total de itens, custo unitário, peso total, peso por tipo de item e todos itens
    return configs.map(config => {
      let {
        smallTruckPrice,
        mediumTruckPrice,
        bigTruckPrice,
        smallTrucks,
        mediumTrucks,
        bigTrucks,
        distance,
        source,
        destination,
        totalCost,
        totalItems,
        unitaryCost,
        totalWeight,
        itemsWeight,
        items
      } = config
      return {
        smallTruckPrice,
        mediumTruckPrice,
        bigTruckPrice,
        smallTrucks: smallTrucks.length,
        mediumTrucks: mediumTrucks.length,
        bigTrucks: bigTrucks.length,
        distance,
        source,
        destination,
        totalCost,
        unitaryCost,
        totalItems,
        itemWeights,
        totalWeight,
        itemsWeight,
        items
      }
    })
  } catch (error) {
    return error
  }
}

const getBestTruckConfigurationForRoute = route => {
  // começo com uma forma não otimizada, porém correta, de distribuição de pesos nos caminhões
  let trucks = trucksSplitByWeight(route.items)

  // agora otimiza-se todos os caminhões com base nos preços,
  // pois 3 caminhões pequenos são mais caro que um caminhão médio, então o peso deles é movido para um caminhão médio novo
  let trucksOptimizedByMoney = optimizeTrucksByMoney(trucks)

  let trucksOptimizedByWeight = optimizeTrucksByWeight(trucksOptimizedByMoney)

  return trucksOptimizedByWeight
}

const optimizeTrucksByWeight = trucks => {
  // a estrutura de caminhões agora já está dividida por capacidade, então pode-se tentar encaixar os pesos dos caminhões pequenos dentro dos caminhões de tamanho maior
  let { smallTrucks, mediumTrucks, bigTrucks } = trucks

  smallTrucks.forEach(smallTruck => {
    // tenta-se colocar o conteúdo de cada caminhão pequeno dentro de um caminhão médio já existente
    let mediumTruckToFitItems = mediumTrucks.find(
      mediumTruck =>
        utils.getWeightPerTruck('MÉDIO') - mediumTruck.weight >=
        smallTruck.weight
    )
    if (mediumTruckToFitItems) {
      mediumTruckToFitItems.weight += smallTruck.weight
      smallTruck.weight = 0
    } else {
      // caso não entre em um caminhão médio, tenta-se em um caminhão grande
      let bigTruckToFitItems = bigTrucks.find(
        bigTruck =>
          utils.getWeightPerTruck('GRANDE') - bigTruck.weight >=
          smallTruck.weight
      )
      if (bigTruckToFitItems) {
        bigTruckToFitItems.weight += smallTruck.weight
        smallTruck.weight = 0
      }
    }
  })

  mediumTrucks.forEach(mediumTruck => {
    // também tenta-se colocar o conteúdo de um caminhão médio dentro de um caminhão grande já existente
    let bigTruckToFitItems = bigTrucks.find(
      bigTruck =>
        utils.getWeightPerTruck('GRANDE') - bigTruck.weight >=
        mediumTruck.weight
    )
    if (bigTruckToFitItems) {
      bigTruckToFitItems.weight += mediumTruck.weight
      mediumTruck.weight = 0
    }
  })

  // remove os caminhões com carga vazia
  smallTrucks = smallTrucks.filter(truck => truck.weight > 0)
  mediumTrucks = mediumTrucks.filter(truck => truck.weight > 0)

  return { smallTrucks, mediumTrucks, bigTrucks }
}

const optimizeTrucksByMoney = trucks => {
  let smallTrucks = trucks.filter(truck => truck.type == 'small')
  let mediumTrucks = trucks.filter(truck => truck.type == 'medium')
  let bigTrucks = trucks.filter(truck => truck.type == 'big')

  // separa-se os caminhões pequenos em pedaços de 3 e colocamos cada pedaço em um caminhão médio novo
  // se o último pedaço é apenas um ou dois caminhões, eles não serão modificados, e serão retornados como caminhões pequenos
  let slicedSmallTrucks = sliceIntoChunks(smallTrucks, 3)
  let remainingSmallTrucks = []
  let newMediumTrucks = []
  slicedSmallTrucks.forEach(chunk => {
    if (chunk.length == 3) {
      chunk.forEach(item => {
        let mediumTruckToFitItems = newMediumTrucks.find(
          mediumTruck =>
            utils.getWeightPerTruck('MÉDIO') - mediumTruck.weight >= item.weight
        )

        if (mediumTruckToFitItems) {
          mediumTruckToFitItems.weight += item.weight
        } else {
          newMediumTrucks.push({ type: 'medium', weight: item.weight })
        }
      })
    } else {
      chunk.forEach(item => {
        let mediumTruckToFitItems = newMediumTrucks.find(
          mediumTruck =>
            utils.getWeightPerTruck('MÉDIO') - mediumTruck.weight >= item.weight
        )
        if (mediumTruckToFitItems) {
          mediumTruckToFitItems.weight += item.weight
        } else {
          remainingSmallTrucks.push(item)
        }
      })
    }
  })
  return {
    smallTrucks: remainingSmallTrucks,
    mediumTrucks: [...mediumTrucks, ...newMediumTrucks],
    bigTrucks
  }
}

const trucksSplitByWeight = items => {
  let trucks = []
  let currentSmallTruckWeight = 0
  let currentMediumTruckWeight = 0
  let currentBigTruckWeight = 0

  // primeiro se tenta colocar os itens nos caminhões pequenos
  // os itens só serão colocados em caminhões de tamanho maior caso o peso deles seja maior que a capacidade do caminhão atual
  // caso contrário, continua-se adicionando caminhões pequenos para a frota

  items.forEach(item => {
    // cada item tem que ser adicionado a quantidade correta de vezes ao caminhão, e também podem ser separados em diferentes caminhões
    // então itera-se sobre a quantidade deles
    for (let i = 0; i < item.amount; i++) {
      // caso o item não possa ser colocado no caminhão pequeno atual, será colocado em um caminhão apropriado
      if (
        currentSmallTruckWeight + item.weight >
        utils.getWeightPerTruck('PEQUENO')
      ) {
        if (currentSmallTruckWeight > 0) {
          trucks.push({ type: 'small', weight: currentSmallTruckWeight })
        }

        // caso esse item entre em um caminhão pequeno, será adicionado um novo caminhão pequeno e o item será colocado lá
        // caso não entre no caminhão pequeno, tenta-se colocar em um caminhão maior, começando pelo caminhão médio
        if (item.weight <= utils.getWeightPerTruck('PEQUENO')) {
          currentSmallTruckWeight = item.weight
        } else {
          currentSmallTruckWeight = 0

          // o mesmo se aplica para o caminhão médio, se o item não puder ser adicionado no caminhão médio atual,
          // tenta-se adicionar a um novo caminhão médio vazio, e se também não for possível, ele é colocado em um caminhão grande
          if (
            currentMediumTruckWeight + item.weight >
            utils.getWeightPerTruck('MÉDIO')
          ) {
            if (currentMediumTruckWeight > 0) {
              trucks.push({ type: 'medium', weight: currentMediumTruckWeight })
            }

            if (item.weight <= utils.getWeightPerTruck('MÉDIO')) {
              currentMediumTruckWeight = item.weight
            } else {
              currentMediumTruckWeight = 0
              if (
                currentBigTruckWeight + item.weight >
                utils.getWeightPerTruck('GRANDE')
              ) {
                // caso não seja mais possível adicionar itens, envia-se o caminhão grande para a frota
                if (currentBigTruckWeight > 0) {
                  trucks.push({ type: 'big', weight: currentBigTruckWeight })
                  currentBigTruckWeight = item.weight
                }
              } else {
                // adiciona o item ao caminhão grande atual
                currentBigTruckWeight += item.weight
              }
            }
          } else {
            // adiciona o item ao caminhão médio atual
            currentMediumTruckWeight += item.weight
          }
        }
      } else {
        // adiciona o item ao caminhão pequeno atual
        currentSmallTruckWeight += item.weight
      }
    }
  })

  // envia o último caminhão pequeno para a frota caso ainda haja algum peso sobrando
  if (currentSmallTruckWeight > 0) {
    trucks.push({ type: 'small', weight: currentSmallTruckWeight })
  }

  // envia o último caminhão médio para a frota caso ainda haja algum peso sobrando
  if (currentMediumTruckWeight > 0) {
    trucks.push({ type: 'medium', weight: currentMediumTruckWeight })
  }

  // envia o último caminhão grande para a frota caso ainda haja algum peso sobrando
  if (currentBigTruckWeight > 0) {
    trucks.push({ type: 'big', weight: currentBigTruckWeight })
  }
  return trucks
}

// método auxiliar para separar o array em pedaços menores de tamanho especificado
const sliceIntoChunks = (arr, chunkSize) => {
  const res = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }
  return res
}

// exporta função para ser utilizada em outro arquivo
exports.getBestTruckConfiguration = getBestTruckConfiguration
