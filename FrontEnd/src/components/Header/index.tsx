import { HeaderContainer } from './styles'
import { List} from 'phosphor-react'
import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <HeaderContainer>
      <NavLink to="/">
        Dell IT Academy - Nicholas Luz
      </NavLink>
    </HeaderContainer>
  )
}
