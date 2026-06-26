# saniya.me — SEO Update (June 2026)

> **Update (latest):** see the [What changed — Round 2](#what-changed--round-2-dark-mode--hero-graphic--spacing-fixes) section near the bottom for the most recent changes (dark mode, hero graphic, spacing/link fixes on the new pages).

This package is a **drop-in replacement** for your current site files. Your
design, colours, fonts, layout, animations and every existing section on the
homepage are untouched. What changed is everything *around* the page —
structure, metadata, new pages, and a few things that quietly fix or improve
discoverability.

## What's new

```
/                           → your existing homepage, lightly cleaned up
/about/                     → new dedicated About page
/projects/                  → new Projects index
/projects/kisanx/           → full KisanX case study
/projects/the-capital-home/ → case study
/projects/vastu-properties/ → case study
/blog/                      → new Blog index
/blog/how-i-built-kisanx/
/blog/full-stack-journey/
/blog/php-vs-mern/
/blog/top-fullstack-projects/
/blog/react-native-jwt-otp/
/resume/                    → new Resume page (with Resume schema + PDF download)
/certifications/            → new Certifications page
/contact/                   → new Contact page
```

Each new page has its own `<title>`, meta description, canonical URL, Open
Graph/Twitter tags, breadcrumb navigation + BreadcrumbList schema, and a
relevant JSON-LD type (AboutPage, CollectionPage, SoftwareApplication,
BlogPosting, ProfilePage, ContactPage, ItemList). They reuse your exact CSS
design system (same colours, fonts, card styles, buttons, grid background)
so they feel like the same site, not a bolt-on.

**Why directories with `index.html` instead of `about.html`?** This gives
you the clean URLs you asked for (`/about/`, `/projects/kisanx/`, etc.)
without needing any server rewrite rules — it works out of the box on
Vercel, Netlify, GitHub Pages, or any static host.

## What changed on the homepage

- **Title/description simplified** to exactly what you specified, and the
  long keyword-stuffed `meta keywords` tag was removed (Google ignores it
  anyway; it's pure stuffing risk for no benefit).
- **Fixed a real bug**: the FAQPage schema script was missing its closing
  `</script>` tag, which silently merged it with the next schema block and
  made *both* invalid JSON-LD. Google was very likely failing to parse your
  FAQ rich-result and KisanX SoftwareApplication schema because of this.
  Fixed.
- **CSS extracted** from a 2,800-line inline `<style>` block into
  `/assets/css/style.css`, shared by every page. Same styles, but now
  cached once across the whole site instead of re-downloaded on every page
  load — a real Core Web Vitals win as the site grows.
- **Images renamed** for SEO as requested:
  - `mypic.png` → `saniya-farooqui-full-stack-developer-mumbai.png`
  - `logoimage.png` → `saniya-farooqui-logo.png`
  - Added descriptive `alt` text to the hero photo.
- **Hero photo optimised**: resized from 1.7MB down to a much lighter PNG,
  plus a WebP sibling (~44KB) served via `<picture>` to modern browsers.
  Visually identical, far lighter.
- **Internal links added** in the footer, project cards, certifications
  section, and FAQ answers pointing to the new pages — without touching the
  visual layout.
- **Schema URLs fixed**: the BreadcrumbList, ItemList and KisanX schema were
  pointing at `#projects` anchor fragments (which Google ignores). They now
  point at the real, indexable project pages.
- All asset paths (favicons, manifest, logo, resume) switched to
  root-relative (`/logo.svg` instead of `logo.svg`) so they resolve
  correctly from any page depth.

## Other files updated

- **`sitemap.xml`** — now lists every new page plus the resume PDF.
- **`sitemap-images.xml`** — updated with the renamed image filenames.
- **`robots.txt`** — fixed a contradiction where `Googlebot-Image` allowed a
  handful of named files but then `Disallow: /`'d everything else, which
  blocked normal image discovery. It's now a clean `Allow: /`. All the AI
  crawler and SEO-tool allowances you already had are preserved.
- **`site.webmanifest`** — shortcut URLs (`Projects`, `Contact`, `Resume`)
  now point at the real new pages instead of homepage anchor fragments that
  didn't exist for two of the three.

## Deploying

Upload everything in this folder to your host exactly as structured,
overwriting your current files. If you're on Vercel/Netlify, just push this
as the new build output — no configuration changes needed, since clean URLs
come from the folder structure itself.

One thing to check: `og-image.jpg` is referenced throughout (Open Graph,
Twitter cards, the image sitemap) but wasn't part of your uploaded files,
so it isn't included here. If it already lives on your live server at
`https://www.saniya.me/og-image.jpg`, no action needed — just make sure you
don't accidentally drop it when you upload this package.

## A couple of notes on the content

- The blog posts are written in first person from your perspective, based
  on the facts in your résumé and the existing site copy. Read through them
  before publishing — a couple of small narrative details (like the IDE
  habits or the exact wording of "what I'd do differently") are reasonable
  extrapolations for a natural developer-blog voice, not things pulled from
  a source. Adjust anything that doesn't sound like you.
- The KisanX GitHub repo links, live-site URLs for The Capital Home and
  Vastu Properties, and all dates/scores carried over from your existing
  site and résumé were kept exactly as you had them.

---

## What changed — Round 2 (dark mode, hero graphic, spacing fixes)

### 1. Personal photo removed from the homepage hero
The `<picture>`/`<img>` block in the hero section is gone. In its place is
a custom inline SVG illustration — a tilted "code editor window" graphic
(title bar, code lines, a `</>` glyph, corner ornaments matching your logo)
drawn entirely in your existing gold/cream/dark palette. Same size and
position as the old photo, so nothing else in the layout shifted.

The photo files themselves (`saniya-farooqui-full-stack-developer-mumbai.png`
+ `.webp`) are still included in the package in case you want them for
LinkedIn or elsewhere, but nothing on the live site displays them anymore.
`sitemap-images.xml` was updated to stop listing them as on-page images.

### 2. Dark mode, site-wide
Every page now has a small sun/moon toggle in the nav bar (and in the
mobile menu). It:
- Respects the visitor's system preference on first visit
- Remembers their choice (`localStorage`) so it persists across pages
- Applies instantly with no flash-of-wrong-theme on load

**Why this took real care:** your colour system reuses `--dark` for two
different jobs — as the *text* colour for headings, and as the
*background* colour for things like the footer, primary buttons, and
badges (which already had light text on a dark background by design).
Flipping `--dark` globally for dark mode would have made the footer/buttons
turn light-on-light and disappear. So dark mode flips the page surface and
heading-ink tokens globally, then explicitly "re-anchors" `--dark` back to
its original near-black value *just* inside the handful of elements that
were already intentionally dark (footer, primary buttons, download button,
phase headers, badges, FAQ active state) — so they stay exactly as they
look today, and everything else correctly inverts.

### 3. Fixed the spacing on every new page
Found the actual bug: the breadcrumb row and the page header both had
their own "clear the fixed nav" top padding stacked on top of each other —
about 250px of dead space before any text appeared. Only one of them needs
that clearance now. Combined with tighter heading/paragraph margins
throughout (`/about/`, `/projects/`, `/blog/` posts, etc.), pages should
feel noticeably less empty/bloated without losing readability.

### 4. Made links look like links
- Inline text links (`a.inline-link`) are now bolder, underlined in gold,
  with a soft highlight on hover — clearer that they're clickable, not just
  slightly-different-coloured text.
- Card "Read more" links are now visible pill buttons with a border, not
  plain text.
- "Related reading" links at the bottom of each page are now bordered rows
  with a hover state, instead of a plain underlined list — each one's
  destination is in its own line so it's obvious what you're clicking into.

If anything on a specific page still feels off (a particular link, a
particular paragraph), point me at that exact page and I'll tighten it
further — this round focused on the patterns that repeat across all of them.
