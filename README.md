# CryptoMondays Fort Lauderdale — Static Site

A lightweight, fast, zero‑backend site you can deploy to **GitHub Pages** and connect to **cryptomondaysfl.com**.

## Quick start

1. Create a new GitHub repo (public is fine), then upload these files.
2. In **Settings → Pages**, choose **Deploy from branch** (e.g., `main` / root).
3. Commit; GitHub Pages will publish your site.
4. Add **CNAME** in this repo (already included) and map your domain in your DNS:

### Recommended (easiest): `www` subdomain
- Add a **CNAME** record for `www.cryptomondaysfl.com` → `YOUR-GITHUB-USERNAME.github.io`
- In repo **Settings → Pages**, set Custom domain to `www.cryptomondaysfl.com` and **Enforce HTTPS**.
- Optionally, forward apex `cryptomondaysfl.com` to `www.cryptomondaysfl.com` in your DNS provider.

### Apex domain (advanced)
Some DNS providers support **ALIAS**/**ANAME**/**Flattening** for apex → `YOUR-GITHUB-USERNAME.github.io`. Use provider docs.

> The CNAME file in this repo sets the canonical domain to `cryptomondaysfl.com`. You can switch to `www.cryptomondaysfl.com` by editing `CNAME`.

## Customize

- **Events**: edit `/assets/events.json` (add as many objects as you like). Times use local time and are rendered automatically.
- **Calendar**: the `/assets/cryptomondays-ftl.ics` file is a sample. Regenerate per event (optional).
- **Socials/Links**: Update links in `index.html` header/footer.
- **Branding**: Replace `/assets/logo.svg`, `/assets/og-cover.png`, `/assets/favicon.svg`.
- **Sponsorship PDF**: Replace `/assets/CM-FTL-Sponsorship-OnePager.pdf` with your own one‑pager (optional).

## Local preview
Open `index.html` directly in a browser, or run a simple server:
```bash
python3 -m http.server 8080
```

## License
MIT — Ship it.
