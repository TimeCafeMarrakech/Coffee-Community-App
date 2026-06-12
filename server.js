import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Firebase App Hosting provides the PORT environment variable dynamically
const PORT = parseInt(process.env.PORT) || 8080;

// Log all incoming requests for debugging in the Firebase Console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve all static files in the root directory
app.use(express.static(__dirname));

// Catch-all route to serve index.html for React SPA navigation
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback error message if the file is missing from the container
    res.status(404).send(`
      <h1>404 - App Not Found</h1>
      <p>Could not find index.html in the deployment container.</p>
      <p>Current directory: ${__dirname}</p>
    `);
  }
});

// Explicitly bind to 0.0.0.0 so the Cloud Run container can receive external traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TIME Coffee App listening on port ${PORT}`);
  console.log(`Serving static files from: ${__dirname}`);
});
