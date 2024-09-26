import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../myBackServers/public/unapeli'  // Especifica la ruta de salida fuera del proyecto
  },
  base: '/dev/',
  server: {
    host: '0.0.0.0',  // Permite el acceso desde cualquier IP
    port: 5173,        // Asegúrate de usar un puerto que no esté ocupado
  },
})
