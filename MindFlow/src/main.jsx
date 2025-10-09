// src/main.jsx
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/Home'
import About from './pages/About'
import IA from './pages/IA'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import MyGlobalStyles from './styles/globalStyles'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const navigateTo = (page) => {
    console.log('🚀 Navegando para:', page) // DEBUG
    setCurrentPage(page)
  }

  console.log('📄 Página atual:', currentPage) // DEBUG

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />
      case 'about':
        return <About navigateTo={navigateTo} />
      case 'ia':
        return <IA navigateTo={navigateTo} />
      case 'login':
        return <Login navigateTo={navigateTo} />
      case 'cadastro':
        return <Cadastro navigateTo={navigateTo} />
      default:
        return <Home navigateTo={navigateTo} />
    }
  }

  return (
    <>
      <MyGlobalStyles />
      {renderCurrentPage()}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)