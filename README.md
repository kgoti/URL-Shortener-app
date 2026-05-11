# ✂️ LinkSnip — URL Shortener

A full-stack URL shortener built with **React** + **Node.js / Express** + **MongoDB**.
Paste any long URL, get a short link, share it, and track how many times it was clicked.

## Features
- Shorten any valid http/https URL
- Duplicate detection — same URL always returns the same short link
- Click tracking — every visit to the short URL increments the counter
- Copy to clipboard with one click
- Delete links you no longer need
- History table showing all shortened URLs with stats

## Tech Stack
| Layer    | Technology                       |
|----------|----------------------------------|
| Frontend | React 18, plain CSS              |
| Backend  | Node.js, Express                 |
| Database | MongoDB with Mongoose            |
| ID gen   | nanoid (short random codes)      |

---

## Folder Structure
```
url-shortener/
├── backend/
│   ├── models/
│   │   └── Url.js          ← Mongoose schema
│   ├── routes/
│   │   └── urls.js         ← POST / GET / DELETE /api/urls
│   ├── .env                ← secrets (not pushed to GitHub)
│   ├── .gitignore
│   ├── package.json
│   └── server.js           ← entry point + redirect route
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js       ← top banner
│   │   │   ├── ShortenForm.js  ← URL input + result card
│   │   │   └── UrlTable.js     ← history table with click stats
│   │   ├── App.js          ← root, manages URL list state
│   │   ├── App.css         ← all styles
│   │   └── index.js        ← React entry point
│   └── package.json
│
└── README.md
```

---

## How to Run

Open **two terminals** — one for backend, one for frontend.

### Terminal 1 — Backend
```bash
cd backend
npm install
npm run dev
```
You should see:
```
Connected to MongoDB
Server running on http://localhost:5000
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm start
```
Opens at **http://localhost:3000**

---

## How it works (the redirect magic)

When you shorten `https://www.example.com/very/long/url`:
1. The backend generates a 6-character code, e.g. `xK3p9q`
2. It saves `{ originalUrl, code, shortUrl: "http://localhost:5000/xK3p9q" }` to MongoDB
3. When anyone visits `http://localhost:5000/xK3p9q`:
   - The backend finds the document with code `xK3p9q`
   - Increments the click counter
   - Sends a 302 redirect to the original URL

---

## How to Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: LinkSnip URL Shortener"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/url-shortener.git
git push -u origin main
```
