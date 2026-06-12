import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Firebase App Hosting provides the PORT environment variable dynamically
const PORT = process.env.PORT || 8080;

// Serve all static files in the root directory
app.use(express.static(__dirname));

// Catch-all route to serve index.html for React SPA navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TIME Coffee App listening on port ${PORT}`);
});
