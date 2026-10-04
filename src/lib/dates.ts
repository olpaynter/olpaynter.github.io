const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Intl's en-GB short month is "Sept", which sits oddly beside the other three-letter months.
/** Formats an ISO date (YYYY-MM or YYYY-MM-DD) as, for example, "Sep 2025". */
export function monthYear(iso: string) {
  const [year, month] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}
