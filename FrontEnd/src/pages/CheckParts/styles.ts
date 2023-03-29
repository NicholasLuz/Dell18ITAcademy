import styled from 'styled-components'

export const HomeContainer = styled.main`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 15rem;
  margin-top: 3rem;

  form {
    display: flex;
    width: 100%;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 3rem;

    p {
      display: flex;
      width: 100%;
      font-size: 1rem;
      font-weight: bold;
      padding-inline: 0.5rem;
      border: 1px solid ${props => props.theme.black};
      border-radius: 8px;
      text-align: center;
    }
  }
`

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