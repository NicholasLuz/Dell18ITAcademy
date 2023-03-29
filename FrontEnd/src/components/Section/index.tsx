import { useState } from "react"
import { FormContainer, BaseSelect, ListContainer, InputsContainer, BaseInput, StartButton, ProductsContainer } from "./styles"
import {v4 as uuidv4} from 'uuid';

// tipagem dos itens adicionados em cada trecho
interface itemProps {
  name: string,
  weight: number,
  quantity: number,
  id: string
}

// tipagem do trecho
export interface SectionProps {
  id: string,
  from?: string,
  to?: string,
  items?: itemProps[],
  cities: string[]
}

// tipagem dos parâmetros recebidos quando o componente é chamado
interface receiveParamsProps {
  section: SectionProps
  onSectionChanged: (section: SectionProps) => void
  onSectionRemoved: (section: SectionProps) => void
}

export function Section({ section, onSectionChanged, onSectionRemoved }: receiveParamsProps ) {
  // criar estado para o trecho atual, podendo modificar quando necessário
  const [ currentSection, setCurrentSection ] = useState(section)

  // setar o estado do trecho atual para o trecho recebido por parâmetro, além de enviar para o componente pai a informação do trecho
  const setSection = (section: SectionProps) => {
    setCurrentSection(section)
    onSectionChanged(section)
  }

  // lidar com a mudança da cidade de origem
  const handleSourceCityChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    let sec = { ...currentSection }
    sec.from = event.target.value
    // seta o estado do trecho, alterando apenas o valor da cidade de origem novo
    setSection(sec)
  }

  // lidar com a mudança da cidade de destino
  const handleDestinationCityChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    let sec = { ...currentSection }
    sec.to = event.target.value
    // seta o estado do trecho, alterando apenas o valor da cidade de destino novo
    setSection(sec)
  }

  // adicionar novo item a lista de itens do trecho
  const addNewItemToList = () => {

    // busca os campos de entrada de dados no documento baseado no id
    const nameInput = document.getElementById(`name${currentSection.id}`) as HTMLInputElement
    const weightInput = document.getElementById(`weight${currentSection.id}`) as HTMLInputElement
    const quantityInput = document.getElementById(`quantity${currentSection.id}`) as HTMLInputElement
    
    // cria um novo objeto com o item dos inputs
    const newItem: itemProps = {
      name: nameInput.value,
      weight: Number(weightInput.value),
      quantity: Number(quantityInput.value),
      id: uuidv4(),
    } 

    // pega os valores ja existentes na lista de itens e adiciona mais esse novo item
    let sec = { ...currentSection }
    sec.items = [...(sec.items || []), newItem]
    setSection(sec)

    
    // retorna os campos do input para vazio
    nameInput.value = "";
    weightInput.value = "";
    quantityInput.value = "";
  }

  // lidar com a remoção de um item da lista
  const handleRemoveItemFromList = (id: string) => {
    let sec = { ...currentSection }
    // busca pelo id qual está sendo removido e cria um novo array sem este item
    let newArray = currentSection.items?.filter(item => item.id !== id)

    // seta o estado do trecho para o novo array sem o item removido
    sec.items = newArray
    setSection(sec)
  }

  // lidar com a remoção de um trecho inteiro, passando essa informação para o componente pai
  const handleRemoveSection = () => {
    onSectionRemoved(section)
  }

  return (
    <>
      <FormContainer>
        <label htmlFor="from">De</label>
        <BaseSelect
          id="from"
          value={currentSection.from}
          onChange={handleSourceCityChange}
        >
          <option value="">Selecione a cidade de partida</option>
          {currentSection.cities.map((city, index) => {
            return (
              <option key={index}>
                {city}
              </option>
            )
          })}
        </BaseSelect>
        <label htmlFor="to">Para</label>
        <BaseSelect
          id="to"
          value={currentSection.to}
          onChange={handleDestinationCityChange}
          placeholder="Digite cidade final"
        >
          <option value="">Selecione a cidade final</option>
          {currentSection.cities.map((city, index) => {
            return (
              <option key={index}>
                {city}
              </option>
            )
          })}
        </BaseSelect>
        <StartButton type="button" onClick={handleRemoveSection} >
            Remover Trecho
          </StartButton>
      </FormContainer>
      <ProductsContainer>
        <ul>
          {currentSection.items?.map((item) => {
            return <ListContainer key={item.id}><p>{item.name}</p> <p>{item.weight}kg</p> <p>{item.quantity} unidades</p> <StartButton type="button" onClick={() => handleRemoveItemFromList(item.id)} >
            Remover itens
          </StartButton></ListContainer>
          })}
        </ul>
      </ProductsContainer>
      <InputsContainer>
        <BaseInput type="text" id={`name${currentSection.id}`} placeholder="Nome do produto" />
        <BaseInput type="number" id={`weight${currentSection.id}`} placeholder="Peso unitário" min="0"/>
        <BaseInput type="number" id={`quantity${currentSection.id}`} placeholder="Quantidade" min="0"/>
        <StartButton type="button" onClick={addNewItemToList} >Adicionar</StartButton>
      </InputsContainer>
    </>  
  )
}