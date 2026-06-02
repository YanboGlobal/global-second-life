# Global Second Life Website

Static bilingual website for `globalsecondlife.com`.

## Run locally

```bash
python3 -m http.server 5173
```

Open `http://localhost:5173/`.

## Add or edit packages

Package content lives in `data/packages.js`. Add a new object to `window.GSL_PACKAGES` with:

- `country`, `state`, `city` in English and Chinese
- `coordinates` for the interactive map pin
- `priceFrom`, `durationDays`, `image`, and optional `video.url`
- `title`, `summary`, `parts`, and `tags` in English and Chinese

Each package currently uses three `parts`, but the UI renders any number of parts.

## Images and videos

Package images are stored in `assets/images/`. For videos, upload hosted MP4 files or embed-ready media, then place the URL in each package's `video.url`. If `video.url` is empty, the site shows a polished video-ready placeholder.

## Payments

The checkout modal is wired as a front-end payment flow with provider choices for Stripe, PayPal, or advisor follow-up. Before accepting real payments, connect the submit handler in `app.js` to a secure backend payment endpoint and add live provider keys only on the server side.

## Deployment

This is a static site, so it can be hosted on Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any web host. Point the `globalsecondlife.com` DNS records to the chosen host after deployment.
