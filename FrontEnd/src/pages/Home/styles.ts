import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-weight: 700;
  font-size: 1.125rem;
  margin-top: 3rem;
  
  a{
    margin-left: 1rem;
    color: ${props => props.theme['gray-600']};
    font-weight: 400;
    text-decoration: none;
    &:hover {
      color: ${(props) => props.theme['green-500']};
    }

    &.active {
      color: ${(props) => props.theme['green-500']};
    }
  }
`