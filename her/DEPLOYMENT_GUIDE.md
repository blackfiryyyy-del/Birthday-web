# 🚀 Step-by-Step Deployment Guide: Sharmi's Birthday Website

This guide walks you through deploying **Sharmi's Birthday Celebration Website** online so anyone (especially Sharmi!) can access it anywhere from their phone or computer via a live link with free HTTPS (e.g., `https://sharmi-birthday.netlify.app` or `https://yourusername.github.io/sharmi-birthday`).

---

## 📁 What You Are Deploying

Your website files are located inside the `public/` directory:
```
d:\her\public\
├── index.html       (Main webpage structure)
├── style.css        (Midnight violet & gold design, mobile layout)
├── app.js           (Synthesizer audio, countdown, butterflies, cake, polaroid wall)
├── config.js        (Config, personalized letter, birthday date)
└── assets/
    └── images/      (All 12 polaroid photos + Sharmi's avatar)
```

Because this website runs entirely on standard HTML5, CSS3, JavaScript, and Web Audio API (with zero external server dependencies needed), it can be deployed on **100% free hosting platforms** with global speed in under 2 minutes!

---

## 🌟 Method 1: Netlify Drag & Drop (Easiest & Fastest — No Coding Needed)

*⏱️ Takes about 1 minute. No terminal, no Git, no command line required.*

1. **Open your web browser** and go to:
   👉 **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
   *(Create a free account or log in with Google/GitHub if prompted).*

2. **Open File Explorer** on your PC and navigate to:
   `D:\her\`

3. **Drag the `public` folder** directly into the dotted upload area on the Netlify Drop webpage:
   > ⚠️ **Important**: Drag the **`public`** folder itself, or drag all files inside `public` directly.

4. Netlify will immediately upload your files and give you a free live URL (e.g., `https://romantic-curie-12345.netlify.app`).

5. **Change to a Custom Birthday Name**:
   - In Netlify, click **"Site configuration"** (or **"Site settings"**).
   - Click **"Change site name"**.
   - Type a custom name like: `happy-birthday-sharmi` or `dude-sharmi-birthday`.
   - Your permanent free link will now be:
     🎉 **`https://happy-birthday-sharmi.netlify.app`**

---

## 🌟 Method 2: GitHub Pages (Free Forever with Git)

*Ideal if you use Git and want a permanent repository.*

### Step 1: Create a GitHub Repository
1. Log in to [GitHub.com](https://github.com).
2. Click the **`+`** icon at top-right → **New repository**.
3. Name it: `sharmi-birthday`.
4. Keep it **Public**, leave other checkboxes blank, and click **Create repository**.

### Step 2: Push Your Code
Open PowerShell on your PC and run:
```powershell
# Navigate to project
Set-Location d:\her

# Initialize git if not already done
git init
git add public/*
git commit -m "Sharmi Birthday Website"

# Link to your GitHub repo (replace YOUR_USERNAME with your GitHub username)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sharmi-birthday.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. On GitHub, go to your repository's **Settings** tab.
2. Click **Pages** in the left sidebar.
3. Under **Build and deployment** → **Source**, select **Deploy from a branch**.
4. Branch: select `main` and folder: select **`/public`** (or `/ (root)` if you moved files to root).
5. Click **Save**.
6. Within 1 minute, your site will be live at:
   🎉 **`https://YOUR_USERNAME.github.io/sharmi-birthday/`**

---

## 🌟 Method 3: Vercel (Ultra-Fast & Modern)

*Free, automatic SSL, and instant preview links.*

1. Go to **[https://vercel.com](https://vercel.com)** and sign in with GitHub or Google.
2. Click **"Add New..."** → **"Project"**.
3. If using Git: Import your `sharmi-birthday` GitHub repository.
   - In **Root Directory**, click **Edit** and choose `public`.
   - Click **Deploy**.
4. Or using Vercel CLI (optional):
   ```powershell
   npm i -g vercel
   cd d:\her\public
   vercel --prod
   ```
5. Your website will be live at:
   🎉 **`https://sharmi-birthday.vercel.app`**

---

## 🌟 Method 4: Render / Cloudflare Pages

### Cloudflare Pages (Fastest Worldwide Edge):
1. Sign in to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**.
2. Click **Create application** → **Pages** → **Direct Upload**.
3. Name the project `sharmi-birthday` and upload the `public` folder.
4. Instant live URL at `https://sharmi-birthday.pages.dev`.

---

## ✅ Pre-Launch Checklist (Test Before Sharing with Sharmi!)

Before sending the link to Sharmi, open your live link on both your phone and PC to verify:

- [ ] **Scene 1 (Countdown)**: Counts down to November 20, 2026. "LET'S START" button plays music.
- [ ] **Scene 2 (Dark Room)**: "LIGHTS ON" turns on party beams, string bulbs, and ambient sparkles.
- [ ] **Scene 3 (Birthday Cake)**: Candles light up with sound, "BLOW THE CANDLES" puffs smoke and confetti.
- [ ] **Avatar Circle**: Sharmi's portrait photo appears inside the glowing ring.
- [ ] **Title**: Says `Happy Birthday, DUDE! 💖✨`.
- [ ] **Personalized Letter**: Reads your custom message and Tamil blessing (`வாழ்க வளமுடன்! ❤️`). "Copy Letter" button works.
- [ ] **11 Butterflies Game**: Flutter in meadow, tap catches them into the glowing jar, motivational card updates with sound.
- [ ] **Letter Vault**: 4 wax-sealed envelopes open when clicked.
- [ ] **Polaroid Wall**: All 12 photos load with zero cropping in a 2-column mobile masonry layout. Clicking any photo opens the full-screen lightbox with navigation arrows.
- [ ] **Scratch-Off Voucher**: Gold metallic foil scratches off smoothly with finger/cursor.
- [ ] **Sky Lantern Launcher**: Typing a wish and pressing enter floats a glowing lantern into the starry sky.
- [ ] **Music Player**: Floating `🎵` / `🔇` button toggles music on and off.

---

## 💌 How to Share with Sharmi

When sharing the link on WhatsApp, Telegram, or Instagram:
1. Paste the link into the chat:
   ```text
   A little birthday world created just for you, Dude! 🎂✨
   Open it with your volume turned up:
   https://happy-birthday-sharmi.netlify.app
   ```
2. Tip: Wait 2-3 seconds for WhatsApp to fetch the preview before hitting send.
3. You can also generate a free QR code using [qr-code-generator.com](https://www.qr-code-generator.com/) and print it inside a physical card!
