import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// PWA Registration
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    // Show a prompt to user if we wanted manual control
    // For now, autoUpdate handles it, but this callback exists
    console.log("New content available, ready to reload.")
  },
  onOfflineReady() {
    console.log("App is ready to work offline.")
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)