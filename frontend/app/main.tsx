import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles/globals.css'
import './styles/app.css'
import App from './App'
import { Providers } from './hooks/providers/providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
      <ToastContainer position="bottom-right" theme="dark" />
    </Providers>
  </StrictMode>,
)
