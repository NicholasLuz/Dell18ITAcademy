import styled from 'styled-components'

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5rem;
  color: ${(props) => props.theme.black};
  font-size: 1.125rem;
  font-weight: bold;

  div {
    display: flex;
    gap: 1rem;
    align-items: center;
    align-self: flex-start;
    justify-content: flex-start;
  }
`

export const BaseSelect = styled.select`
  background: transparent;
  height: 2.5rem;
  width: 25rem;
  border: 1px solid;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.125rem;
  padding: 0 0.5rem;
  color: ${(props) => props.theme['base-subtitle']};
`

export const InputsContainer = styled.div`
  display: flex;
  width: 40rem;
  height: 2rem;
  align-self: center;
  justify-content: space-between;
  gap: 1rem;
`

export const BaseInput = styled.input`
  background: transparent;
  height: 2rem;
  border: 0;
  font-weight: bold;
  border: 1px solid ${props => props.theme.black};
  border-radius: 8px;
  font-size: 1rem;
  padding: 0 0.5rem;
  color: ${(props) => props.theme.black};

  &:focus {
    box-shadow: none;
    border-color: ${(props) => props.theme['green-500']};
  }

  &::placeholder {
    color: ${(props) => props.theme['gray-500']};
  }
`

export const ListContainer = styled.li`
  display: flex;
  gap: 1rem;
  width: 40rem;
  height: 2rem;
  margin-bottom: 0.5rem;

  p {
    display: flex;
    height: 100%;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    align-self: center;
  }
`

export const StartButton = styled.button`
  width: 15rem;
  border: 1px solid;
  padding: 1rem;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.black};
  background: ${(props) => props.theme['base-button']};

  font-weight: bold;

  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;

    &:hover {
      background-color: ${props => props.theme['base-button']};
    }
  }

  &:hover {
    background: ${props => props.theme['green-300']};
    opacity: 0.7;
    color: ${props => props.theme.black};
    transition: 300ms;
  }
`

export const ProductsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`