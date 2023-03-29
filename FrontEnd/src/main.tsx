import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App'

// função main que renderiza a aplicação
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
