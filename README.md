# ⚛ MedPhys Reader — Daily Learning System

A personal platform to build deep Medical Physics knowledge before your PhD.  
Read real papers → Write summaries → Get AI feedback on concepts AND writing quality.

---

## What It Does

- **Curated curriculum** — 8 papers from Beginner → Advanced with real PubMed links
- **Add your own papers** — Upload PDF, paste a PubMed link, or paste raw text
- **AI reads your paper** — Extracts key concepts automatically
- **You write a summary** — In your own words, without looking at the paper
- **AI compares and scores** — Concept coverage score + Writing quality score
- **Streak tracker** — Stay consistent day by day

---

## Deployment Guide (Step by Step — No experience needed)

### Step 1: Create a GitHub Account

1. Go to [github.com](https://github.com) and click **Sign up**
2. Choose a username, enter your email, create a password
3. Verify your email address

---

### Step 2: Install Git on Your Computer

**On Windows:**
1. Go to [git-scm.com/download/win](https://git-scm.com/download/win)
2. Download and run the installer (keep all default settings)
3. Open **Git Bash** (search it in Start Menu)

**On Mac:**
1. Open **Terminal** (search with Spotlight: Cmd+Space → "Terminal")
2. Run: `git --version`
3. If not installed, it will prompt you to install it — click Install

---

### Step 3: Install Node.js

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version (left button)
3. Run the installer with default settings
4. Verify by opening Terminal/Git Bash and running:
   ```
   node --version
   npm --version
   ```
   You should see version numbers.

---

### Step 4: Create a GitHub Repository

1. Log into GitHub
2. Click the **+** icon (top right) → **New repository**
3. Name it: `medphys-reader`
4. Keep it **Public**
5. Do NOT check "Initialize with README"
6. Click **Create repository**
7. Copy the URL shown — it looks like: `https://github.com/YOUR_USERNAME/medphys-reader.git`

---

### Step 5: Set Up the Project Locally

Open Terminal (Mac) or Git Bash (Windows):

```bash
# Navigate to where you want to put the project
# For example, your Desktop:
cd ~/Desktop

# Create the project folder and enter it
mkdir medphys-reader
cd medphys-reader

# Copy all the project files into this folder
# (The files you downloaded from Claude go here)

# Initialize git
git init

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/medphys-reader.git

# Install dependencies
npm install

# Test it runs locally
npm run dev
# Open http://localhost:5173 in your browser
```

---

### Step 6: Deploy to Vercel (Free Hosting)

Vercel is the easiest way to deploy — your app goes live in under 2 minutes.

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** → choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. Click **Add New Project**
5. Find `medphys-reader` in your repositories → click **Import**
6. Leave all settings as default
7. Click **Deploy**

✅ Your app will be live at: `https://medphys-reader-YOURNAME.vercel.app`

---

### Step 7: Push Updates (Whenever You Change Code)

Every time you update the app, run:

```bash
git add .
git commit -m "describe what you changed"
git push origin main
```

Vercel will automatically redeploy within 30 seconds. 🚀

---

### Step 8: Get Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / Log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-`)
5. Paste it into the app when you first open it

Your key is stored only in your own browser. Nobody else can see it.

---

## Running Locally (Development)

```bash
npm install       # first time only
npm run dev       # starts at http://localhost:5173
npm run build     # creates production build
npm run preview   # preview the production build
```

---

## Project Structure

```
medphys-reader/
├── index.html                    # Entry HTML
├── vite.config.js                # Vite build config
├── package.json                  # Dependencies
├── src/
│   ├── main.jsx                  # React entry
│   ├── App.jsx                   # Root component + state
│   ├── papers.js                 # Curated paper list (edit to add more!)
│   ├── api.js                    # Claude API calls
│   └── components/
│       ├── Library.jsx           # Paper list view
│       ├── Reader.jsx            # Reading + summary + feedback
│       ├── AddPaper.jsx          # Add custom papers
│       └── ApiKeySetup.jsx       # API key entry screen
```

---

## Adding More Curated Papers

Open `src/papers.js` and add an object to the `CURATED_PAPERS` array:

```js
{
  id: "c9",
  level: "Intermediate",        // Beginner | Intermediate | Advanced
  week: 4,
  topic: "MRI Physics",
  title: "MRI Fundamentals: Relaxation Times and Contrast Mechanisms",
  summary: "Your 2-3 sentence description here.",
  keyPoints: [
    "T1 and T2 relaxation mechanisms",
    "Spin echo vs gradient echo sequences",
    "Contrast agents and their mechanism",
    "k-space and Fourier reconstruction"
  ],
  pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/YOUR_PMID/",
  readTime: "40 min",
  citation: "Author et al. Journal. Year.",
  curated: true
}
```

---

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **Claude API** — AI feedback and paper extraction
- **mammoth.js** — DOCX text extraction
- **PubMed E-utilities API** — Abstract fetching
- **localStorage** — Progress persistence

---

Built for Abhilash — future Medical Physics PhD student 🔬
