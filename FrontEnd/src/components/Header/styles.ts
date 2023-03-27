import styled from 'styled-components'

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block: 2rem;
  
  a {
    color: ${props => props.theme.black};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    text-decoration: none;
    font-size: 1.125rem;
    font-weight: 700;
  }
`
