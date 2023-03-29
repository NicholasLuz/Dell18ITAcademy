import { HeaderContainer } from './styles'
import { NavLink } from 'react-router-dom'

// criação do header que será mostrado em todas páginas
export function Header() {
  return (
    <HeaderContainer>
      <NavLink to="/">
        Dell IT Academy - Nicholas Luz
      </NavLink>
    </HeaderContainer>
  )
}
