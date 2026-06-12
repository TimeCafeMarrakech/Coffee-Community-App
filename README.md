# TIME Coffee & Community

A premium mobile application for TIME, a modern lifestyle brand combining specialty coffee, coworking, and community in Marrakech.

## How to Upload to GitHub (Resolving the Build Error)

As an AI, I cannot generate a direct `.zip` file download link. To fix your Firebase App Hosting deployment and get your code into GitHub, you must manually save these files to your local computer and push them to your repository.

### Step 1: Save the Files Locally
Create a new folder on your computer (e.g., `time-app`). Inside this folder, create the exact files provided in this conversation with their exact contents:
- `index.html`
- `index.tsx`
- `App.tsx`
- `types.ts`
- `data.ts`
- `metadata.json`
- `package.json` (Crucial for fixing the buildpack error)
- `firebase.json`
- `apphosting.yaml`
- `components/BottomNav.tsx`
- `components/Logo.tsx`
- `views/HomeView.tsx`
- `views/OrderView.tsx`
- `views/CommunityView.tsx`
- `views/ExperiencesView.tsx`
- `views/LoginView.tsx`
- `views/CheckoutView.tsx`
- `views/ChatView.tsx`
- `views/StaffView.tsx`

### Step 2: Push to GitHub
Open your terminal or command prompt, navigate to your `time-app` folder, and run the following commands:

```bash
# Initialize git
git init

# Add all your files
git add .

# Commit the files
git commit -m "Add complete application source code and package.json"

# Link to your GitHub repository (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push the code to the main branch
git branch -M main
git push -u origin main
```

### Step 3: Firebase App Hosting
Once the files (especially `package.json`) are in your GitHub repository, Firebase App Hosting will automatically detect the push, trigger a new Cloud Build, successfully detect the Node.js buildpack, and deploy your application.
