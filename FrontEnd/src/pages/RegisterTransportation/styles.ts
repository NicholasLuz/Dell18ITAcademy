import styled from 'styled-components'

export const HomeContainer = styled.main`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;

  form {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
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

    .section {
      display: flex;
      width: 100%;
      flex-direction: column;
      gap: 0.5rem;
    }
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
  }

  &:hover {
    background: ${props => props.theme['green-300']};
    opacity: 0.7;
    color: ${props => props.theme.black};
    transition: 300ms;
  }
`

export const SectionsSeparation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
`