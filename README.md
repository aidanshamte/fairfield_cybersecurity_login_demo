# Fairfield Cybersecurity Login — Training Demo

This is a visual cybersecurity/phishing-awareness training simulation.

## Important safety behavior

- The password form never submits.
- Password input is cleared when Verify is clicked.
- No credentials are stored.
- No credentials are sent to a server.
- The links are non-functional training interactions.

## Run it

Open `index.html` directly in a browser.

Or, from this folder:

```bash
python -m http.server 8000
```

Then visit:

http://localhost:8000

## Files

- `index.html` — page structure
- `style.css` — visual design and responsive layout
- `script.js` — show/hide password and safe demo interactions
