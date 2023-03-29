import { NavLink } from "react-router-dom";
import { HomeContainer } from "./styles";

// página home, que mostra as funcionalidades, podendo navegar entre elas
export function Home() {
  return (
  <HomeContainer>
    <div>
      O que deseja fazer ?
    </div>
    <NavLink to='CheckParts'>1) Consultar trechos x modalidade</NavLink>
    <NavLink to='RegisterTransportation'>2) Cadastrar transporte</NavLink>
    <NavLink to='Report'>3) Consultar relatório dos transportes cadastrados</NavLink>
  </HomeContainer>
    )
}