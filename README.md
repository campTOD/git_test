# Sugar Coat Beauty — Static Site

Quick start:

- Serve locally: `python3 -m http.server 8080` then open http://localhost:8080
- Main files: `index.html`, `assets/styles.css`, `assets/main.js`

Customize booking:

- In `assets/main.js`, set `BOOKING_URL` to your Calendly/Square/GlossGenius booking URL.
- The booking modal lazy-loads Calendly. If you use a different system, keep `bookingExternal` link and replace the embed as needed.

Theme colors:

- Edit CSS variables at the top of `assets/styles.css` (e.g., `--accent`, `--text`, `--surface`) for grey/white accents.

Content:

- Update services, testimonials, and images directly in `index.html`.
- Replace Unsplash images with your own for production.