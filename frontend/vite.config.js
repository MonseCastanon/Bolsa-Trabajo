/**
 * vite.config.js
 *
 * Configuración de Vite para el frontend.
 * El proxy redirige /api/* al backend Flask en :5000
 * para evitar problemas de CORS en desarrollo.
 */

import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  server: {
    port: 5173,
    proxy: {
      // Toda petición a /api/... se redirige al backend Flask
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
