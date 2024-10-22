import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { NotificationProvider } from './context/NotificationContext';
import './index.css'
import 'bulma/css/bulma.min.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <NotificationProvider>
    <StrictMode>
      <App />
    </StrictMode>,
    </NotificationProvider>
  </AuthProvider>

)
