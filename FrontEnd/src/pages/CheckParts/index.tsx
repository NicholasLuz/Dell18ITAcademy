import React, { useEffect, useState } from 'react'
import { FormContainer, BaseSelect, StartButton, HomeContainer } from './styles'

// tipagem do trecho que será buscado
interface searchSection {
  from?: string,
  to?: string,
  truckType?: string
}

// tipagem das informações recebidas da busca no backend
interface distanceAndPriceProps {
  price: number
  distance: string
}

export function CheckParts() {
  // criação dos estados para as cidades do csv, dos tipos de caminhão, das informações do trecho, e do resultado da busca
  const [ cities, setCities] = useState([])
  const [ trucks, setTrucks] = useState([])
  const [ distanceAndPrice, setDistanceAndPrice ] = useState<distanceAndPriceProps>()
  const [ searchSection, setSearchSection ] = useState<searchSection>()

  // ja realiza na renderização a busca no backend pelas cidades do csv e os tipos de caminhão
  useEffect(() => {
    const loadCities = async () => {
      const response = await fetch("http://localhost:3000/cities")
      const cities = await response.json()
      setCities(cities)
    }
    const loadTrucks = async () => {
      const response = await fetch("http://localhost:3000/trucks")
      const trucks = await response.json()
      setTrucks(trucks)
    }
    loadCities()
    loadTrucks()
  }, [])

  // lida com a mudança da cidade de origem
  const handleSourceCityChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    let sec = { ...searchSection }
    sec.from = event.target.value
    setSearchSection(sec)
  }

  // lida com a mudança da cidade de destino
  const handleDestinationCityChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    let sec = { ...searchSection }
    sec.to = event.target.value
    setSearchSection(sec)
  }

  // lida com a mudança do tipo de caminhão
  function handleSelectTruckChange(event:React.ChangeEvent<HTMLSelectElement>) {
    let sec = { ...searchSection }
    sec.truckType = event.target.value
    setSearchSection(sec)
  }

  // lida com o envio do formulário, e logo da requisição ao backend das informações
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadInfo = async () => {
      const response = await fetch(`http://localhost:3000/distance?from=${searchSection?.from}&to=${searchSection?.to}&truck=${searchSection?.truckType}`)
      // armazena as informações obtidas de distância e preço no estado
      const { price, distance } = await response.json()
      setDistanceAndPrice({price, distance})
    }
    loadInfo()
  }

  // booleano para verificar se o formulário pode ser enviado ou não
  let disableButton = (!searchSection?.from) || (!searchSection?.to) || (!searchSection?.truckType)
  
  return (
    <>
    <HomeContainer>
        <form onSubmit={handleSubmit} action="">
          <FormContainer>
            <label htmlFor="from">De</label>
            <BaseSelect
              id="from"
              value={searchSection?.from}
              onChange={handleSourceCityChange}
            >
              <option value="">Selecione a cidade de partida</option>
              {cities.map((city, index) => {
                return (
                  <option key={index}>
                    {city}
                  </option>
                )
              })}
            </BaseSelect>
          </FormContainer>

          <FormContainer>

            <label htmlFor="to">Para</label>
            <BaseSelect
              id="to"
              value={searchSection?.to}
              onChange={handleDestinationCityChange}
              placeholder="Digite cidade final"
            >
              <option value="">Selecione a cidade final</option>
              {cities.map((city, index) => {
                return (
                  <option key={index}>
                    {city}
                  </option>
                )
              })}
            </BaseSelect>
            
          </FormContainer>
          
          <FormContainer>
          <label htmlFor="truck">Caminhão</label>
            <BaseSelect
              id="from"
              value={searchSection?.truckType}
              onChange={handleSelectTruckChange}
            >
              <option value="">Selecione o porte do caminhão</option>
              {trucks.map((truck, index) => {
                return (
                  <option key={index}>
                    {truck}
                  </option>
                )
              })}
            </BaseSelect>
          </FormContainer>
          <StartButton type="submit" disabled={disableButton}>
            Enviar
          </StartButton>

          {(!!distanceAndPrice?.distance && !!distanceAndPrice?.price) ?
          (
            <p>
              De {searchSection?.from} para {searchSection?.to}, utilizando um caminhão de porte {searchSection?.truckType}, a distância é de {Number(distanceAndPrice?.distance).toLocaleString('pt-BR')}km e o custo será de {distanceAndPrice?.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.
            </p>
          )
          :
          null
          
        }
        </form>
      </HomeContainer>
    </>
  )
}