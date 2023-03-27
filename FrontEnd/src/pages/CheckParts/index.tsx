import React, { useEffect, useState } from 'react'
import { FormContainer, BaseSelect, StartButton, HomeContainer } from './styles'

export function CheckParts() {
  const [ cities, setCities] = useState([])
  const [ trucks, setTrucks] = useState([])
  const [ selectedCity1, setSelectedCity1] = useState('')
  const [ selectedCity2, setSelectedCity2] = useState('')
  const [ selectedTruck, setSelectedTruck] = useState('')
  const [ price, setPrice] = useState()
  const [ distance, setDistance] = useState()
  const [ initialCity, setInitialCity] = useState('')
  const [ finalCity, setFinalCity] = useState('')
  const [ truck1, setTruck1] = useState('')

  useEffect(() => {
    const loadCities = async () => {
      const response = await fetch("http://localhost:3000/getCities")
      const cities = await response.json()
      setCities(cities)
    }
    const loadTrucks = async () => {
      const response = await fetch("http://localhost:3000/getTrucks")
      const trucks = await response.json()
      setTrucks(trucks)
    }
    loadCities()
    loadTrucks()
  }, [])

  function handleSelectCity1Change(event:React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCity1(event.target.value)
  }
  function handleSelectCity2Change(event:React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCity2(event.target.value)
  }
  function handleSelectTruckChange(event:React.ChangeEvent<HTMLSelectElement>) {
    setSelectedTruck(event.target.value)
  }

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadInfo = async () => {
      const response = await fetch(`http://localhost:3000/getInfo?from=${selectedCity1}&to=${selectedCity2}&truck=${selectedTruck}`)
      const { price, distance } = await response.json()
      setPrice(price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
      setDistance(distance)
    }
    loadInfo()
    setInitialCity(selectedCity1)
    setFinalCity(selectedCity2)
    setInitialCity(selectedCity1)
    setTruck1(selectedTruck)
  }

  let disableButton = (!selectedCity1) || (!selectedCity2) || (!selectedTruck)
  
  return (
    <>
    <HomeContainer>
        <form onSubmit={handleSubmit} action="">
          <FormContainer>
            <label htmlFor="from">De</label>
            <BaseSelect
              id="from"
              value={selectedCity1}
              onChange={handleSelectCity1Change}
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
              value={selectedCity2}
              onChange={handleSelectCity2Change}
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
              value={selectedTruck}
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

          {(!!price && !!distance) ?
          (
            <p>
              De {initialCity} para {finalCity}, utilizando um caminhão de porte {truck1}, a distância é de {distance}km e o custo será de {price}.
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