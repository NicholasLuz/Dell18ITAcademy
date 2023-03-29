import { useState, useEffect } from "react"
import { HistoryContainer, HistoryList } from "./styles"

// tipagem das informações de cada trecho
export interface SectionInfoProps {
  smallTrucks: number
  mediumTrucks: number
  bigTrucks: number
  totalCost: number
  unitaryCost: number
  source: string,
  destination: string,
  distance: string,
  totalItems: number,
  itemWeights: {},
  smallTruckPrice: number,
  mediumTruckPrice: number,
  bigTruckPrice: number,
  items: {
    name: string,
    amount: number,
    weight: number
  }[]
}

// tipagem das informações de cada transporte cadastrado
interface transportationProps {
  id: string,
  section: SectionInfoProps[]
}

export function Report() {
  // criação do estado para armazenar todos transportes cadastrado
  const [ transportation, setTransportation ] = useState<transportationProps[]>([])

  //  logo na renderização da página, realiza a obtenção dos transportes armazenados, fazendo uma busca no backend
  useEffect(() => {
    const getAllTransportation = async () => {
      const response = await fetch('http://127.0.0.1:3000/transportation')
      const transportationInfo = await response.json()
      // armazena no estado essas informações
      setTransportation(transportationInfo)
    }
    getAllTransportation()
  },[])

  // função para realizar a soma total dos preços dos trechos
  const sumTotalCost = (id: string) => {
    const arr = transportation.find(transp => transp.id == id)
    let sum = arr!.section.reduce((acc, currentValue) => acc + currentValue.totalCost, 0)
    return sum
  }

  // função para realizar a média de preços dos trechos do transporte
  const averageSectionCost = (id: string) => {
    const arr = transportation.find(transp => transp.id == id)
    const totalCost = sumTotalCost(id)
    let cont = totalCost/arr!.section.length

    return cont;
  }

  // função para realizar a média de preço por km rodado no transporte
  const averageKmCost = (id: string) => {
    const arr = transportation.find(transp => transp.id == id)
    let totalDist = arr!.section.reduce((acc, currentValue) => acc + Number(currentValue.distance), 0)
    const totalCost = sumTotalCost(id)
    let cont = totalCost/totalDist

    return cont;
  }

  // função que retorna a quantidade de caminhões utilizados por trecho
  const totalTrucks = (id:string) => {
    return transportation.find(transp => transp.id == id)?.section.map((sec, index) => {
      let total = sec.bigTrucks + sec.mediumTrucks + sec.smallTrucks

      return <div key={index}>Trecho {index+1}: {total.toLocaleString('pt-BR')}</div>
    })
  }

  // função que retorna o custo por tipo de caminhão no transporte
  const costPerTruckType = (id:string) => {
    const arr = transportation.find(transp => transp.id == id)
    let bigTrucks = arr!.section.reduce((acc, currentValue) => acc + currentValue.bigTruckPrice, 0)
    let mediumTrucks = arr!.section.reduce((acc, currentValue) => acc + currentValue.mediumTruckPrice, 0)
    let smallTrucks = arr!.section.reduce((acc, currentValue) => acc + currentValue.smallTruckPrice, 0)
    
    return (
      <>
        <div>P: {smallTrucks.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        <div>M: {mediumTrucks.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        <div>G: {bigTrucks.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
      </>
    )
  }

  // função que mostra os custos totais por trecho
  const costPerSection = (id: string) => {
    return transportation.find(transp => transp.id == id)?.section.map((sec, index) => (
      <div key={index}>Trecho {index+1}: {sec.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
    ))
  }

  // função que mostra os itens inicialmente transportados
  const getInitialItems = (id:string) => {
    const arr = transportation.find(transp => transp.id == id)
    return arr?.section[0].totalItems
  }

  return (
    <HistoryContainer>
      <h1>Relatório de Transportes</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Transporte</th>
              <th>Custo total</th>
              <th>Custo médio/trecho</th>
              <th>Custo médio/km</th>
              <th>Total veículos</th>
              <th>Total itens transportados</th>
              <th>Custo médio/tipo de produto</th>
              <th>Custo total/trecho</th>
              <th>Custo total/modalidade</th>
            </tr>
          </thead>
          <tbody>
          {transportation.map((transp, index) => {
              return (
                <tr key={transp.id}>
                  <td>{index+1}</td>
                  <td>{sumTotalCost(transp.id).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td>
                  {averageSectionCost(transp.id).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td>
                    {averageKmCost(transp.id).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td>
                    {totalTrucks(transp.id)}
                  </td>
                  <td>
                    {getInitialItems(transp.id)}
                  </td>
                  <td>Funcionalidade não desenvolvida</td>
                  <td>{costPerSection(transp.id)}</td>
                  <td>{costPerTruckType(transp.id)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}