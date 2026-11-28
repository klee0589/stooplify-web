// Listings live for one week. After that they drop off the browse pages, map,
// calendar and home sections automatically so events never sit around forever.
export const LISTING_TTL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// Local calendar date as YYYY-MM-DD. Never use toISOString() for this: it returns
// the UTC date, which rolls over at 7-8pm Eastern and would hide every listing
// dated "today" for the rest of the evening.
export const localDateStr = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ISO timestamp N days ago — used as a server-side filter on created_date
export const postingCutoffISO = () => new Date(Date.now() - LISTING_TTL_DAYS * DAY_MS).toISOString();

// Merge the one-week window into any YardSale query
export const activeSaleQuery = (query = {}) => ({
  ...query,
  created_date: { $gte: postingCutoffISO() },
});

export const isListingActive = (sale) => {
  if (!sale) return false;

  // Posted more than a week ago → expired
  if (sale.created_date) {
    const posted = new Date(sale.created_date);
    if (!Number.isNaN(posted.getTime()) && Date.now() - posted.getTime() > LISTING_TTL_DAYS * DAY_MS) {
      return false;
    }
  }

  // Event date slipped more than a week into the past → expired
  if (sale.date) {
    const [y, m, d] = String(sale.date).split('-').map(Number);
    if (y && m && d) {
      const cutoff = startOfToday();
      cutoff.setDate(cutoff.getDate() - LISTING_TTL_DAYS);
      if (new Date(y, m - 1, d) < cutoff) return false;
    }
  }

  return true;
};

export const filterActiveListings = (sales = []) =>
  (Array.isArray(sales) ? sales : []).filter(isListingActive);

// Whole days left before the listing expires (0 = expires today)
export const listingDaysLeft = (sale) => {
  if (!sale?.created_date) return LISTING_TTL_DAYS;
  const posted = new Date(sale.created_date).getTime();
  if (Number.isNaN(posted)) return LISTING_TTL_DAYS;
  const left = Math.ceil((posted + LISTING_TTL_DAYS * DAY_MS - Date.now()) / DAY_MS);
  return Math.max(0, left);
};