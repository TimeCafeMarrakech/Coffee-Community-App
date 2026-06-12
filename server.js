import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
// Firebase App Hosting provides the PORT environment variable dynamically
const PORT = parseInt(process.env.PORT) || 8080;

// In Google Cloud containers, the app is run from /workspace. 
// process.cwd() reliably points to this directory.
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
    // If it still fails, this will print exactly what files ARE in the container 
    // to help us debug if GitHub missed any files during the commit.
    let dirContents = 'Unable to read directory';
    try {
        dirContents = fs.readdirSync(rootDir).join(', ');
    } catch (e) {}
    
    res.status(404).send(`
      <div style="font-family: sans-serif; padding: 2rem;">
        <h1>404 - App Not Found</h1>
        <p>Could not find <strong>index.html</strong> in the deployment container.</p>
        <p><strong>Searched in:</strong> ${rootDir}</p>
        <p><strong>Files present in this directory:</strong><br/> ${dirContents}</p>
        <hr/>
        <p><em>Note: If your source files (.tsx, .html) are not listed above, please ensure they were successfully committed and pushed to your GitHub repository.</em></p>
      </div>
    `);
  }
});

// Explicitly bind to 0.0.0.0 so the Cloud Run container can receive external traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TIME Coffee App listening on port ${PORT}`);
  console.log(`Serving static files from: ${rootDir}`);
});
