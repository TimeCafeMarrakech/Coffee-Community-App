import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Point root to the parent directory where index.html and source files live
  root: '../', 
  build: {
    // Output the compiled files into frontend/dist
    outDir: 'frontend/dist',
    emptyOutDir: true
  },
  preview: {
    // Dynamically bind to the PORT provided by Firebase App Hosting
    port: parseInt(process.env.PORT) || 8080,
    host: '0.0.0.0',
    allowedHosts: true
  }
});
