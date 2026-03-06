# Stooplify

**Live URL:** [stooplify.com](https://stooplify.com)

Stooplify is a hyperlocal marketplace for discovering and listing yard sales, garage sales, stoop sales, and estate sales — focused primarily on Brooklyn and New York City, with expanding coverage in Los Angeles, San Francisco, and beyond.

---

## Tech Stack

### Frontend
- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Accessible UI components (Radix UI based)
- **Framer Motion** — Animations and transitions
- **React Router DOM v6** — Client-side routing
- **@tanstack/react-query v5** — Server state, caching, mutations
- **date-fns** — Date formatting and manipulation
- **lucide-react** — Icon library
- **react-leaflet** — Interactive maps (OpenStreetMap)
- **react-markdown** — Blog content rendering
- **react-hook-form + zod** — Form validation
- **sonner** — Toast notifications
- **canvas-confetti** — Celebratory animations
- **qrcode.react** — QR code generation
- **jspdf + html2canvas** — PDF flyer generation
- **@supabase/supabase-js** — Supabase client
- **@sentry/react** — Error monitoring
- **@stripe/react-stripe-js + @stripe/stripe-js** — Stripe frontend

### Backend
- **Base44** — BaaS (auth, database, file storage, integrations)
- **Deno** — Serverless backend functions runtime
- **Supabase** — Secondary database for synced listings
- **Stripe (Live Mode)** — Real payment processing
- **Sentry** — Frontend error tracking

### Fonts
- **Poppins** (headings) + **Inter** (body) via Google Fonts

---

## Platform & Infrastructure

| Service | Purpose |
|---------|---------|
| Base44 BaaS | Auth, CRUD, file uploads, integrations |
| Supabase | Secondary DB for listing sync |
| Stripe (Live) | Payments — $9/mo subscription, $4 single listing |
| Google AdSense | Ad monetization (`ca-pub-9420381871665480`) |
| Sentry | Frontend error tracking |
| Google Fonts | Poppins + Inter typography |

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| `Home` | `/Home` | Landing page — hero, stats, featured sales, founder bio |
| `YardSales` | `/YardSales` | Browse page — map + list view, filters, discovery directory |
| `YardSaleDetails` | `/YardSaleDetails?id=` | Full detail view for a single listing |
| `AddYardSale` | `/AddYardSale` | Multi-step form to create or edit a listing |
| `MyYardSales` | `/MyYardSales` | Seller dashboard |
| `Favorites` | `/Favorites` | Saved sales for logged-in users |
| `Messages` | `/Messages` | In-app buyer/seller messaging |
| `Profile` | `/Profile` | Profile, settings, notifications, subscription management |
| `Calendar` | `/Calendar` | Calendar view of upcoming sales |
| `Blog` | `/Blog` | Blog index |
| `BlogSlug` | `/BlogSlug?slug=` | Dynamic blog post page |
| `BlogPost` | `/BlogPost` | Admin blog creation/editing |
| `Guides` | `/Guides` | Seller/buyer guide hub |
| `Pricing` | `/Pricing` | Pricing plans |
| `Legal` | `/Legal` | Terms, Privacy, Disclaimer, Safety |
| `ChatSupport` | `/ChatSupport` | Support chat |
| `ApplyAsShop` | `/ApplyAsShop` | Business/shop application |
| `SellerPage` | `/SellerPage?id=` | Public seller profile |
| `AdminCommunityLocations` | `/AdminCommunityLocations` | Admin: community map pins |
| `AdminSupabaseSync` | `/AdminSupabaseSync` | Admin: sync listings to Supabase |

### SEO Landing Pages

**Cities:** Brooklyn, Queens, Manhattan, Bronx, Jersey City, Los Angeles, San Francisco

**Neighborhoods:** Williamsburg, Park Slope, Bushwick, Bed-Stuy, Crown Heights, Greenpoint, Astoria, Upper West Side, Harlem

**Dates:** Today, Saturday, Sunday, This Weekend

**Categories:** Furniture, Vintage Clothing, Books, Electronics, Antiques, Toys

---

## Entities (Database)

### `YardSale`
Core listing entity.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Listing title |
| `description` | string | Items description |
| `date` | date | Date of sale |
| `start_time` / `end_time` | string | Time range |
| `general_location` | string | Fuzzy public location |
| `address` | string | Full address (hidden until day of) |
| `city`, `state`, `zip_code` | string | Location fields |
| `latitude`, `longitude` | number | Approximate map coordinates |
| `exact_latitude`, `exact_longitude` | number | Exact coords (unlocked day-of) |
| `categories` | string[] | Multi-select: general, furniture, clothing, electronics, toys, antiques, books, sports, multi-family |
| `photos` | string[] | Photo URLs |
| `status` | enum | `pending`, `approved`, `rejected` |
| `views` | number | View count |
| `payment_cash`, `payment_card`, `payment_digital` | boolean | Payment methods accepted |
| `report_count` | number | Community reports |
| `auto_flagged`, `flag_reason` | boolean/string | Auto-moderation |
| `publish_delay_until` | datetime | Anti-spam delay for new users |
| `supabase_id` | string | Cross-DB sync ID |

### `Favorite`
| Field | Type |
|-------|------|
| `yard_sale_id` | string |
| `user_email` | string |

### `Attendance`
| Field | Type |
|-------|------|
| `yard_sale_id` | string |
| `user_email` | string |
| `notify_reminder` | boolean |
| `attended` | boolean |

### `Report`
| Field | Type |
|-------|------|
| `yard_sale_id` | string |
| `reporter_email` | string |
| `reason` | enum: no_sale_at_location, feels_unsafe, suspicious_listing, spam, inappropriate |
| `details` | string |
| `status` | enum: pending, reviewed, resolved |

### `YardSaleReview`
| Field | Type |
|-------|------|
| `yard_sale_id` | string |
| `user_email` | string |
| `rating` | number (1–5) |
| `comment` | string |
| `attended` | boolean |
| `helpful_count` | number |

### `Message`
| Field | Type |
|-------|------|
| `yard_sale_id` | string |
| `sender_email` | string |
| `recipient_email` | string |
| `content` | string |
| `read` | boolean |

### `EmailSubscriber`
| Field | Type |
|-------|------|
| `email` | string |
| `city` | string |
| `notify_new_sales` | boolean |

### `AlertPreference`
| Field | Type |
|-------|------|
| `user_email` | string |
| `alert_type` | enum: distance, category |
| `value` | string |
| `latitude`, `longitude` | number |
| `is_active` | boolean |

### `BlogPost`
| Field | Type |
|-------|------|
| `title`, `title_es` | string |
| `slug` | string |
| `content`, `content_es` | string (markdown) |
| `excerpt`, `excerpt_es` | string |
| `featured_image_url` | string |
| `meta_description`, `meta_description_es` | string |
| `meta_keywords`, `tags` | string[] |
| `publish_date` | datetime |
| `status` | enum: draft, published, archived |
| `reading_time_minutes`, `view_count` | number |

### `ShopApplication`
Business listing applications with status workflow (pending → approved/rejected), featured flag, and subscription tracking.

### `ShopReview`
Star ratings and comments for approved shops.

### `CommunityLocation`
Admin-placed map pins: neighborhood hubs, parking, event venues, popular areas.

### `VerifiedScan`
QR code scan records for buyer geo-validation and credit rewards.

### `CreditTransaction`
Credit ledger: scan_reward, referral, bonus, admin_adjustment, spent.

### `User` (Built-in)
Extended fields on the built-in user:

| Field | Notes |
|-------|-------|
| `role` | `admin` or `user` |
| `profile_picture` | Uploaded photo URL |
| `phone` | For SMS notifications |
| `subscription_active` | Stripe active subscription |
| `free_listings_used` | Count of free listings consumed |
| `notification_enabled` | Master notification toggle |
| `notification_email`, `notification_sms` | Channels |
| `notify_new_sales`, `notify_favorites`, `notify_reminders` | Notification types |

---

## Backend Functions (Deno)

| Function | Description |
|----------|-------------|
| `createCheckout` | Creates Stripe checkout session (single listing or subscription) |
| `stripeWebhook` | Handles Stripe events — updates subscription/listing status |
| `geocodeAddress` | Geocodes address to lat/lng |
| `geocodeYardSales` | Batch geocodes listings missing coordinates |
| `sendInstantSaleAlert` | Emails subscribers when a new sale is approved |
| `sendWeeklyAlerts` | Weekly digest email to alert subscribers |
| `getSellerInfo` | Returns seller public profile |
| `getUserData` | Returns current user data |
| `processScan` | Validates QR scan, awards buyer credits |
| `sitemap` | Generates XML sitemap for SEO |
| `generateWeeklyBlogPost` | AI-generates weekly blog post via LLM |
| `backfillBlogTranslations` | Adds Spanish translations to existing blog posts |
| `supabaseSync` | Syncs listings Base44 → Supabase |
| `supabasePullUpdates` | Pulls updates Supabase → Base44 |
| `cleanupDuplicateListings` | Deduplication task |
| `resetAllData` | Admin: wipe test data |
| `resetFreeListings` | Admin: reset user free listing counts |
| `resetUserListings` | Admin: reset specific user listing data |
| `generateTestData` | Admin: seed test listings |
| `testNotifications` | Admin: send test notifications |
| `testSupabase` | Admin: test Supabase connection |

---

## Features

### For Buyers
- Map view with clustering (zoom to expand clusters), community pins, re-center button
- List view filtered to within 25 miles of user location
- Filters: category, date (today/tomorrow/weekend/week), payment method, text search
- Favorites with optimistic UI (instant heart toggle)
- Attend / RSVP with reminders
- Post-attendance star reviews with helpful vote
- Direct messaging to sellers
- Smart alerts: distance-based or category-based for new sales
- Notification preferences: email/SMS per type
- Pull-to-refresh (mobile swipe gesture)
- "Show ended sales" toggle

### For Sellers
- Multi-step listing form: Details → Location (geocoded) → Photos + Payment
- AI-generated description from uploaded photos
- Up to 5 photo uploads per listing
- Free tier: 1 listing per account
- Pay-per-listing: $4 one-time (Stripe)
- Unlimited subscription: $9/month (Stripe)
- Publish delay for new accounts (anti-spam)
- Auto-flagging for suspicious content
- QR code generation for physical distribution
- Printable PDF flyer export
- "Live Now" indicator with pulsing green dot in profile
- Sales grouped in profile: Live Now → Upcoming → Finished

### Discovery & SEO
- City, neighborhood, date, and category landing pages (20+ pages)
- Schema.org Event structured data for Google rich results
- Dynamic `<SEO>` component per page (title, description, OG, canonical)
- XML sitemap via backend function

### Internationalization
- English / Spanish toggle, persisted in `localStorage`
- Full translation object with `useTranslation` hook (dot-notation keys)
- Blog posts have separate `title_es`, `content_es`, `excerpt_es` fields

### Dark Mode
- System preference auto-detection on first load
- Manual toggle (moon/sun) in nav and mobile menu
- Persisted in `localStorage`
- Full `dark:` class coverage across all components

### Mobile UX
- Fixed bottom navigation bar (Home, Browse, Post, Messages, Profile)
- Scroll-to-top on any tab switch
- Unread message badge on nav
- Back arrow in header for non-root screens
- Pull-to-refresh
- Safe area insets for iOS notch/home bar
- Responsive 1→2→3→4 column grid layouts
- MobileDiscovery tabbed component for browsing by city/neighborhood/date/category

### Analytics (Base44)
- `home_page_viewed`, `yard_sales_page_viewed`, `profile_page_viewed`
- `sale_favorited`, `sale_unfavorited`
- `sales_filtered`, `filters_reset`, `view_mode_changed`
- `email_subscribed`, `email_subscription_started`

### Error Monitoring
- Sentry `SentryErrorBoundary` wraps the entire app
- User context (email/ID) attached to all Sentry events

---

## Payment Flow

1. User creates listing → saved as `pending`
2. Free listing available → awaits admin approval
3. No free listing → Stripe checkout ($4 one-time or $9/month)
4. `stripeWebhook` receives `checkout.session.completed`
5. Webhook updates `subscription_active` or `free_listings_used`
6. Admin approves listing → goes live
7. Iframe detection blocks checkout in embedded contexts

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Live Stripe API key |
| `STRIPE_PUBLISHABLE_KEY` | Live Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Live webhook signing secret |
| `STRIPE_TEST_SECRET_KEY` | Test Stripe API key |
| `STRIPE_TEST_PUBLISHABLE_KEY` | Test publishable key |
| `STRIPE_TEST_WEBHOOK_SECRET` | Test webhook secret |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (admin) |
| `SENTRY_DSN` | Sentry error reporting DSN |
| `BASE44_APP_ID` | Auto-injected by Base44 platform |

---

## Component Structure

components/ ├── home/ │ ├── HeroSection Hero, email capture, CTAs, animated background │ ├── HowItWorks 3-step explainer │ ├── FeaturedSales Featured sales grid │ └── CTASection Call-to-action banner ├── sales/ │ ├── SaleCard Listing card component │ ├── SaleMap Leaflet map with clustering + community pins │ ├── SaleFilters Filter bar + mobile bottom sheet │ ├── MobileDiscovery Tabbed mobile browse directory │ ├── AddressDisplay Fuzzy/exact address toggle │ ├── QRCodeDisplay QR code per listing │ ├── ScanQRButton Buyer scan button │ ├── PrintableFlyer PDF export │ ├── ReportModal Report listing │ ├── SafetyNote Safety tips │ ├── ShareModal Social share + copy link │ ├── TrustBadges Seller trust indicators │ └── SellerReputation Star rating summary ├── messaging/ │ ├── MessageThread Buyer message view │ └── SellerMessageView Seller inbox ├── reviews/ │ ├── ReviewForm Review submission │ └── ReviewList Reviews display with helpful votes ├── profile/ │ └── AlertSettings Smart alert configuration ├── seo/ │ ├── CityLandingPage │ ├── NeighborhoodLandingPage │ ├── DateLandingPage │ ├── CategoryLandingPage │ └── WeekendSalesPage ├── SEO Dynamic meta tag manager ├── BottomNavBar Mobile bottom navigation ├── PullToRefresh Touch gesture refresh wrapper ├── ThemeProvider Dark/light mode context ├── SentryErrorBoundary App-level error boundary ├── GuideContent Shared guide renderer ├── SupabaseSync Admin sync UI ├── UserNotRegisteredError Fallback for unregistered users └── translations EN/ES strings + useTranslation hook


---

## Contact

**Founder:** Daniel  
**Email:** daniel@stooplify.com  
**Instagram:** [@stooplify](https://www.instagram.com/stooplify/)  
**Facebook:** [Stooplify](https://www.facebook.com/profile.php?id=61586102653727)
