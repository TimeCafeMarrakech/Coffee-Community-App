import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Firebase App Hosting provides the PORT environment variable dynamically
const PORT = process.env.PORT || 8080;

// In Google Cloud containers, the app is run from /workspace. 
// We check both __dirname and process.cwd() to ensure we find the static files.
const rootDir = fs.existsSync(path.join(__dirname, 'index.tsx')) ? __dirname : process.cwd();

// Log all incoming requests for debugging in the Firebase Console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve all static files (like index.tsx, App.tsx, etc.) from the root directory
app.use(express.static(rootDir));

// Fallback HTML in case index.html is missing or misplaced in the container filesystem
const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TIME | Coffee & Community</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        saffron: '#D4A017',
                        walnut: '#2B2321',
                        terracotta: '#D06D4D',
                        linen: '#F5F2EB',
                        base: '#FCFAF6',
                        pure: '#FFFFFF'
                    },
                    fontFamily: {
                        sans: ['Inter', 'SF Pro Display', 'sans-serif'],
                        serif: ['Georgia', 'serif'],
                    },
                    boxShadow: {
                        'premium': '0 10px 30px -10px rgba(43, 35, 33, 0.08)',
                        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #FCFAF6;
            color: #2B2321;
            -webkit-tap-highlight-color: transparent;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
    </style>
    <script type="importmap">
    {
        "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
            "lucide-react": "https://esm.sh/lucide-react@0.292.0",
            "framer-motion": "https://esm.sh/framer-motion@10.16.4",
            "@google/genai": "https://esm.sh/@google/genai@1.20.0"
        }
    }
    </script>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="./index.tsx"></script>
</body>
</html>`;

// Catch-all route to serve index.html for React SPA navigation
app.get('*', (req, res) => {
  const indexPath = path.join(rootDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Serve the fallback HTML directly from memory to satisfy the CDN and load the app
    res.status(200).send(fallbackHtml);
  }
});

// Explicitly bind to 0.0.0.0 so the Cloud Run container can receive external traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TIME Coffee App listening on port ${PORT}`);
  console.log(`Serving static files from: ${rootDir}`);
});
