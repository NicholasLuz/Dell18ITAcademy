import { useEffect, useState } from "react"
import { Section, SectionProps } from "../../components/Section"
import { HomeContainer, StartButton, SectionsSeparation } from "./styles"
import {v4 as uuidv4} from 'uuid';
import { SectionInfoProps } from '../Report'

export function RegisterTransportation() {
  // cria estado para as cidades possiveis do csv
  const [ cities, setCities] = useState([])
  // cria estado para os trechos existentes a cada novo cadastro
  const [ sections, setSections] = useState<SectionProps[]>([])
  // cria estado para as informações buscadas no backend sobre o trecho cadastrado
  const [ sectionInfo, setSectionInfo ] = useState<SectionInfoProps[]>([])

  // renderiza no iniciar da pagina para ja buscar no backend as cidades do csv e seta elas no estado
  useEffect(() => {
    // usada função assincrona para aguardar o resultado do backend
    const loadCities = async () => {
      const response = await fetch("http://localhost:3000/cities")
      const cities = await response.json()
      setCities(cities)
    }
    loadCities()
  }, [])

  // função para lidar com o envio do formulário
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const answer = async () => {
      // cria-se o objeto itinerário para que seja cadastrado no backend as informações do transporte cadastrado
      const itinerary = sections.map(section => ({
        source: section.from,
        destination: section.to,
        items: section.items?.map(item => ({
          name: item.name,
          weight: item.weight,
          amount: item.quantity
        }))
      }))

      // envio da requisição com o método post
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(itinerary)
      };

      // armazenando a resposta do backend com as informações já prontas sobre distância, preços, caminhões
      const response = await fetch('http://localhost:3000/bestTrucks', requestOptions)
      const bestTrucks = await response.json()
      console.log(bestTrucks)
      // armazenando no estado essas infos
      setSectionInfo(bestTrucks)
    }
    answer()
  }

  // adicionar uma nova seção quando o botão é clicado na página
  const addSection = () => {
    setSections([
      ...sections,
      {cities: cities, id: uuidv4()}
    ])
  }

  // função para envio de informações para cada componente filho (trecho), para que quando cadastrado, ele possa comunicar o componente pai da alteração na lista de trechos
  const onSectionChanged = (section: SectionProps) => {
    const sectionIndex = sections.findIndex(sec => sec.id == section.id)
    if (sectionIndex != -1) {
      let newSections = [...sections]
      newSections[sectionIndex] = section
      setSections(newSections)
    }
  }
  // mesma coisa que a função acima, feita para o componente filho comunicar o pai da exclusão dele da lista
  const onSectionRemoved = (section: SectionProps) => {
    const sectionsFiltered = sections.filter(sec => sec.id != section.id)
    setSections(sectionsFiltered)
  }

  return (
    <>
    <HomeContainer>
        <form onSubmit={handleSubmit} action="">

          { sections.map(section => (
            <Section key={section.id} section={section} onSectionChanged={onSectionChanged} onSectionRemoved={onSectionRemoved}/>
          )) }

          {(sectionInfo.length > 0) ? <SectionsSeparation>
            {sectionInfo.map((section, index) => {
              return <div key={index}>Trecho {index + 1}: de {section.source} para {section.destination}, a distância a ser percorrida é de {section.distance} km, para transporte dos produtos: {<span>{section.items.map(item => `${item.name}) ${item.amount} unidade(s), `)}</span>} será necessário utilizar {(section.smallTrucks > 0) ? (section.smallTrucks > 1) ? <span>{section.smallTrucks} caminhões de porte PEQUENO,</span> : <span>{section.smallTrucks}  caminhão  de porte PEQUENO,</span> : null} {(section.mediumTrucks > 0) ? (section.mediumTrucks > 1) ? <span>{section.mediumTrucks} caminhões de porte MÉDIO,</span> : <span>{section.mediumTrucks} caminhão  de porte MÉDIO,</span> : null} {(section.bigTrucks > 0) ? (section.bigTrucks > 1) ? <span>{section.bigTrucks} caminhões de porte GRANDE,</span> : <span>{section.bigTrucks} caminhão  de porte GRANDE,</span> : null} de forma a resultar no menor custo de transporte por km rodado. O valor total do transporte dos itens é de {section.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}, sendo {section.unitaryCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} o custo unitário médio.</div>
            })}
          </SectionsSeparation> : null}
          
          <StartButton type="button" onClick={addSection}>
            Adicionar novo trecho
          </StartButton>
          <StartButton type="submit" >
            Enviar
          </StartButton>
        </form>
      </HomeContainer>
    </>
  )
}