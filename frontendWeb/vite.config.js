import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // Toutes les requêtes vers /api seront redirigées
        target: 'http://localhost:4000', // URL de votre backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Optionnel : supprime /api de l'URL
      },
    },
  },
});