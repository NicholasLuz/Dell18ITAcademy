import { Routes, Route } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { CheckParts } from './pages/CheckParts'
import { Home } from './pages/Home'
import { RegisterTransportation } from './pages/RegisterTransportation'
import { Report } from './pages/Report'

// função das rotas, que define o layout default, com header e paginas, sendo cada pagina denotada com seu caminho especifico
export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/CheckParts" element={<CheckParts />} />
        <Route path="/RegisterTransportation" element={<RegisterTransportation />} />
        <Route path="/Report" element={<Report />} />
      </Route>
    </Routes>
  )
}
