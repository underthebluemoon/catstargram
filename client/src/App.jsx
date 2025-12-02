import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/common/Header.jsx'
import ProtectedRouter from './routes/ProtecedRouter.jsx';

function App() {
  return (
    <>
      <Header />
      <ProtectedRouter />      
    </>
  )
}

export default App;