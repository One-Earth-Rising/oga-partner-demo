# OGA™ IP Partner Demo

Interactive demo page that shows IP partners how OGA™ technology transforms their characters across multiple game engines.

## What This Is

A standalone web page with:
- **3×3 character grid** — square action shots with 3D tilt hover effects
- **Loading sequence** — game engine initialization animation
- **Transformation arena** — select a game, watch the character transform with particle effects
- **Fully config-driven** — swap characters, games, and images by editing the top of one file

Built with **Vite + React**. Deploys to **Netlify** as a static site.

---

## Quick Start (Run Locally)

### Prerequisites
- **Node.js** (v18 or later) — Download from https://nodejs.org
- You can check if it's installed: `node --version`

### Steps

```bash
# 1. Open Terminal, navigate to this project folder
cd oga-partner-demo

# 2. Install dependencies (only needed the first time)
npm install

# 3. Start the local dev server
npm run dev
```

This opens at **http://localhost:5173** — the page auto-refreshes when you edit files.

---

## How to Add Character Images

1. Get square action shots for each character (400×400px minimum, WebP or PNG)
2. Drop them into the `/public/images/` folder
3. Open `src/App.jsx` and update the `CHARACTERS` array at the top:

```js
{
  id: "tony",
  name: "TONY THE TIGER",
  label: "Frosted Flakes",
  color: "#FF6B1A",
  tileImage: "/images/tony-tile.webp",      // ← grid tile image
  detailImage: "/images/tony-detail.png",    // ← arena center image
  gameImages: {                               // ← optional per-game renders
    fortnite: "/images/tony-fortnite.png",
    roblox: "/images/tony-roblox.png",
  },
},
```

**Image notes:**
- `tileImage` — Square action shot for the 3×3 grid. Gets cropped to square via CSS.
- `detailImage` — Shown in the transformation arena center. Can be different from tile.
- `gameImages` — OPTIONAL. If you have pre-rendered art showing the character in a specific game's style, add it here. If not provided, CSS filters simulate the transformation.
- Files in `/public/` are served from the root: `/public/images/tony.webp` → `/images/tony.webp`

---

## How to Swap to a Different IP Partner

Everything partner-specific is in the first ~100 lines of `src/App.jsx`:

### 1. Update partner info
```js
const PARTNER_INFO = {
  name: "MARVEL",
  badge: "MARVEL × OGA™",
  contact: "PARTNERS@ONEEARTHRISING.COM",
  cta: "WANT TO ACTIVATE YOUR IP ACROSS MULTIPLE GAMES?",
};
```

### 2. Update characters
Replace the `CHARACTERS` array with the new IP's characters. Each needs:
- `id` — unique identifier
- `name` — display name (shown in ALL CAPS)
- `label` — subtitle (e.g., franchise name)
- `color` — accent color for that character's glow and hover effects
- `tileImage` — path to grid image
- `detailImage` — path to arena image

### 3. Update games (if different)
Replace the `GAMES` array if the partner cares about different titles.

### 4. Done
Everything below the "END OF CONFIGURATION" comment is engine code — you don't need to touch it.

---

## Deploy to Netlify

### First Time Setup

1. Push this project to a GitHub repo:
```bash
cd oga-partner-demo
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/One-Earth-Rising/oga-partner-demo.git
git push -u origin main
```

2. Go to **https://app.netlify.com** → "Add new site" → "Import an existing project"

3. Connect your GitHub repo

4. Netlify auto-detects the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. Click **Deploy** — you'll get a URL like `oga-partner-demo.netlify.app`

### After That
Every push to `main` auto-deploys. Just:
```bash
git add .
git commit -m "Add toucan images"
git push
```

### Custom Domain (Later)
When `oga.oneearthrising.com` HTTPS is working:
1. In `vite.config.js`, change `base` to `'/partners/kelloggs/'`
2. In your main OGA Netlify site, add a rewrite rule in `_redirects`:
   ```
   /partners/kelloggs/*  https://oga-partner-demo.netlify.app/:splat  200
   ```
3. This proxies the path through your main domain.

---

## Project Structure

```
oga-partner-demo/
├── public/
│   └── images/              ← Drop character images here
│       ├── tony-tile.webp   ← Tony's grid tile (included)
│       ├── toucan-tile.png  ← (you add these)
│       └── ...
├── src/
│   ├── main.jsx             ← React entry point (don't edit)
│   └── App.jsx              ← Main component + CONFIG AT TOP
├── index.html               ← HTML shell
├── package.json             ← Dependencies
├── vite.config.js           ← Build config (base path here)
├── netlify.toml             ← Netlify deploy config
└── README.md                ← You're reading it
```

---

## Common Commands

```bash
npm run dev       # Start local dev server (http://localhost:5173)
npm run build     # Build for production → /dist folder
npm run preview   # Preview the production build locally
```

---

## Troubleshooting

**"command not found: npm"** → Install Node.js from https://nodejs.org

**Images not showing** → Make sure they're in `/public/images/` (not `/src/images/`)

**Blank page after deploy** → Check that `base` in `vite.config.js` matches your deploy path

**Tony shows but others are placeholders** → That's expected! Add images and update `tileImage` in the config.

---

*One Earth Rising P.B.C. — The infrastructure for the next era of gaming.*
