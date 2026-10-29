# Sensus — multi-page prototype

Open `index.html` in your browser. Every sidebar destination has its own HTML file under `pages/`, and navigation uses actual page loads. Styling lives in `css/style.css`; shared screen rendering and prototype interactions live in `js/app.js`. Browser `sessionStorage` keeps demo chat, mood check-ins, journal entries and settings when moving between pages in the same tab. Closing the session may clear them.

This is a refactor of the supplied prototype, not a production app. The original scripted responses and simulated functionality are retained. Individual pages currently use a shared JavaScript renderer rather than independently maintained HTML screen markup.
