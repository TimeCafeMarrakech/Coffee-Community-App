import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
// Firebase App Hosting provides the PORT environment variable dynamically
const PORT = process.env.PORT || 8080;

// In Google Cloud containers, the app is run from /workspace. 
const rootDir = process.cwd();

// Log all incoming requests for debugging in the Firebase Console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Explicitly define a basic GET route for the root path (/)
// This ensures the CDN recognizes a healthy page even if static files are delayed
app.get('/', (req, res) => {
  const indexPath = path.join(rootDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Sends a string response back so the CDN recognizes a healthy page
    res.status(200).send('TIME Coffee App Backend is running (CDN Health Check OK). Please ensure index.html is deployed.');
  }
});

// Serve all static files (like index.tsx, App.tsx, etc.) from the root directory
app.use(express.static(rootDir));

// Catch-all route to serve index.html for React SPA navigation
app.get('*', (req, res) => {
  const indexPath = path.join(rootDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <div style="font-family: sans-serif; padding: 2rem;">
        <h1>404 - App Not Found</h1>
        <p>Could not find <strong>index.html</strong> in the deployment container.</p>
        <p><strong>Searched in:</strong> ${rootDir}</p>
      </div>
    `);
  }
});

// Explicitly bind to 0.0.0.0 so the Cloud Run container can receive external traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TIME Coffee App listening on port ${PORT}`);
  console.log(`Serving static files from: ${rootDir}`);
});
