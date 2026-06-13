# TIME Coffee & Community

A premium mobile application for TIME, a modern lifestyle brand combining specialty coffee, coworking, and community in Marrakech.

## Final Deployment Steps (Manual Push Required)

As an AI, I do not have direct access to your local terminal or GitHub credentials to execute the push command. To complete the deployment and trigger Firebase App Hosting, please run the following commands in your terminal at the root of your project:

```bash
# Stage all the updated configuration files
git add .

# Commit the changes
git commit -m "Fix Firebase App Hosting configuration and routing"

# Push to your connected GitHub repository
git push origin main
```

Once pushed, navigate to your Firebase Console > App Hosting. You will see a new rollout building automatically. Because we have configured `server.js` to handle the dynamic routing and `package.json` to use it as the main entry point, the Cloud Build Node.js buildpack will successfully deploy your unified application!

## Repository Structure & Firebase App Hosting Setup

This project is designed as a **Unified App deployed from the Root Directory (`/`)**. It is NOT a split monorepo. The Node.js Express server (`server.js`) and the React frontend (`index.html`, `App.tsx`) live together in the root to simplify deployment on Firebase App Hosting.

### Cleanup Instructions
If you manually created `frontend/`, `backend/`, or `public/` folders, **delete them** (except for the placeholder `public/index.html` we just created for the CDN). Move all essential files back to the root directory so your repository looks exactly like this:
- `/index.html` (Your main frontend entry point)
- `/index.tsx`
- `/App.tsx`
- `/server.js` (Your Express backend)
- `/package.json`
- `/firebase.json`
- `/apphosting.yaml`
- `/public/index.html` (CDN placeholder)
- `/components/...`
- `/views/...`

### Firebase App Hosting Configuration
When setting up or editing your Firebase App Hosting rollout in the Google Cloud / Firebase Console:
1. **Root Directory:** Set this to exactly `/` (the root). Do not point it to `/frontend` or `/backend`.
2. **Environment Variables:** Ensure `API_KEY` is set for the Gemini AI features.
3. **Deployment Flow:** Firebase will automatically detect `package.json` in the root, run the `build` script, and execute `npm start` (which runs `node server.js`). `server.js` will then serve your `index.html` and React files dynamically.
