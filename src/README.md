# Stooplify 🪑

**The NYC-focused marketplace for stoop sales, yard sales, and garage sales.**

Live at: [stooplify.com](https://stooplify.com)

---

## What is Stooplify?

Stooplify is a hyperlocal platform built for New York City that makes it easy to discover and list stoop sales, yard sales, and garage sales across all five boroughs. Think of it as a digital garage sale with built-in foot traffic, trust tools, and neighborhood intelligence.

---

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **Backend:** Base44 (BaaS — database, auth, functions, integrations)
- **Serverless Functions:** Deno Deploy (via Base44)
- **Maps:** React Leaflet + OpenStreetMap
- **Payments:** Stripe (Live Mode)
- **Analytics:** PostHog
- **Error Tracking:** Sentry
- **Geocoding:** Google Maps API

---

## Features

### For Buyers
- 🗺️ Interactive map of all upcoming sales near you
- 📅 Calendar view to browse sales by date
- ❤️ Save favorites and get reminders
- 🔔 Smart neighborhood alerts (email/push)
- 💬 Message sellers directly through the app
- 📱 QR code scan-in at sales to earn credits
- ⭐ Read seller ratings and reviews
- 🎁 Browse free giveaway items near you

### For Sellers
- 📝 List a sale in under 5 minutes
- 🤖 AI-generated listing description from photos
- 📍 Privacy-first: exact address only revealed on sale day
- 🖨️ Printable + shareable flyer with QR code
- 💳 Accept cash, card, Venmo/digital payments
- 📊 Track views and attendance
- 🏷️ Free first listing; $4/single or $9/month unlimited

---

## Pricing

| Plan | Price | Details |
|---|---|---|
| Free | $0 | 1 listing (first sale free) |
| Single Listing | $4 one-time | Pay per listing after free tier |
| Unlimited | $9/month | Post unlimited concurrent sales |

---

## SEO & Landing Pages

City and borough-specific landing pages for organic search:

- `/garage-sales-nyc`
- `/stoop-sales-nyc`
- `/garage-sales-brooklyn`
- `/garage-sales-manhattan`
- `/garage-sales-queens`
- `/garage-sales-bronx`
- `/stoop-sales-park-slope`
- `/stoop-sales-williamsburg`
- `/free-stuff-nyc`, `/free-stuff-brooklyn`, `/free-stuff-queens`

Seller guides (SEO content):
- `/guides-advertise-yard-sale`
- `/guides-best-time-yard-sale`
- `/guides-permit-requirements-nyc`
- `/guides-pricing-yard-sale-items`
- `/guides-seniors-yard-sales`
- `/guides-find-yard-sales`

Blog: 200+ bilingual (EN/ES) posts published via automated pipeline.

---

## Key Entities

| Entity | Description |
|---|---|
| `YardSale` | Core listing — date, location, categories, photos, status |
| `BlogPost` | Bilingual blog content (EN + ES) with SEO metadata |
| `Favorite` | User-saved sales |
| `Attendance` | RSVP / "I'm Attending" records |
| `Message` | Buyer ↔ seller messaging threads |
| `YardSaleReview` | Post-sale star ratings and comments |
| `VerifiedScan` | QR code scan-in records with geo-validation |
| `CreditTransaction` | Credits earned via verified scans |
| `EmailSubscriber` | Newsletter subscribers |
| `AlertPreference` | User notification preferences by distance/category |
| `Report` | Community safety reports on listings |
| `ShopApplication` | Partner shop applications |

---

## Backend Functions

| Function | Purpose |
|---|---|
| `createCheckout` | Stripe checkout session creation |
| `stripeWebhook` | Stripe webhook handler (payment events) |
| `getSellerInfo` | Fetch public seller profile data |
| `geocodeAddress` | Google Maps geocoding for listings |
| `generateQRToken` | Generate signed QR tokens for sale check-in |
| `processScan` | Validate QR scans, award credits |
| `sendWeeklyAlerts` | Email digest of nearby sales |
| `sendInstantSaleAlert` | Notify users of new matching sales |
| `notifyAdminNewSale` | Admin email on new listing submission |
| `generateDailyBlogPosts` | Automated blog content generation |
| `sitemap` | Dynamic XML sitemap for SEO |
| `robots` | robots.txt handler |

---

## Localization

Full bilingual support (English / Spanish) across:
- UI translations (`components/translations.js`)
- Blog posts (`content_es`, `title_es`, `excerpt_es`)
- AI-powered on-demand description translation

Language toggle stored in `localStorage` as `stooplify_lang`.

---

## Community Stats (as of April 2026)

- 👥 21 registered users
- 🏷️ 25+ approved listings
- 📝 215+ published blog posts
- 🗺️ Active in: Brooklyn, Queens, Manhattan, Bronx

---

## Local Development

```bash
npm install
npm run dev
```

Requires environment variables (set in Base44 dashboard):
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GOOGLE_MAPS_API_KEY`
- `QR_TOKEN_SECRET`
- `SENTRY_DSN`

---

## Contact

**Daniel Lee** — Founder  
📧 daniel@stooplify.com  
📸 [@stooplify](https://instagram.com/stooplify)  
🌐 [stooplify.com](https://stooplify.com)