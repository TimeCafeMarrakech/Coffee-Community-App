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

// Serve all static files (like index.tsx, App.tsx, etc.) from the root directory
app.use(express.static(rootDir));

// Catch-all route to serve index.html for React SPA navigation
app.get('*', (req, res) => {
  const indexPath = path.join(rootDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback response to satisfy the CDN health checker if index.html is missing
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>TIME Coffee Backend</title></head>
        <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h1>TIME Coffee Backend Active</h1>
          <p>The Node.js server is running successfully from the frontend folder on Firebase App Hosting.</p>
          <p><em>Note: If you see this instead of the app, ensure index.html is in the same directory.</em></p>
        </body>
      </html>
    `);
  }
});

// Explicitly bind to 0.0.0.0 so the Cloud Run container can receive external traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TIME Coffee App listening on port ${PORT}`);
  console.log(`Serving static files from: ${rootDir}`);
});
