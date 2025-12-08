import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/common/Header.jsx'
import ProtectedRouter from './routes/ProtecedRouter.jsx'
import NotificationInfo from './components/subscriptions/NotificationInfo.jsx';

function App() {
  return (
    <>
      <Header />
      <ProtectedRouter />  
      <NotificationInfo />    
    </>
  )
}

export default App;