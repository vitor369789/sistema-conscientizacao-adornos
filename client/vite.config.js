import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      host: '0.0.0.0', // Permite acesso externo
      allowedHosts: [
        'adornoshmm.d36.com.br',
        '.d36.com.br', // Permite todos os subdomínios
        'localhost',
      ],
      hmr: {
        clientPort: 443, // Porta HTTPS para WebSocket
        protocol: 'wss', // WebSocket seguro
      },
    },
  }
})
