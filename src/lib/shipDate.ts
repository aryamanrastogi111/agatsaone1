import { format } from "date-fns";

/**
 * Returns the next shipping date based on IST rules:
 * - If before 6 PM IST on a weekday → ships today
 * - If after 6 PM IST or on a weekend → ships next business day
 */
export function getShipDate(): Date {
  // Current time in IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60; // minutes
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = utcMinutes + istOffset;
  const istHour = Math.floor((istMinutes % 1440) / 60);
  
  // IST day of week (adjust if IST has crossed midnight but UTC hasn't)
  const istDate = new Date(now.getTime() + istOffset * 60 * 1000);
  const dayOfWeek = istDate.getUTCDay(); // 0=Sun, 6=Sat

  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isBefore6PM = istHour < 18;

  if (isWeekday && isBefore6PM) {
    return istDate;
  }

  // Find the next business day
  let next = new Date(istDate);
  do {
    next.setUTCDate(next.getUTCDate() + 1);
  } while (next.getUTCDay() === 0 || next.getUTCDay() === 6);

  return next;
}

/** Estimated delivery = ship date + 3 business days */
export function getDeliveryDate(): Date {
  let d = getShipDate();
  let added = 0;
  while (added < 3) {
    d = new Date(d);
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) added++;
  }
  return d;
}

/** "Ships Today" or "Ships Mon, Jun 16" */
export function shipDateLabel(): string {
  const ship = getShipDate();
  const today = new Date();
  const istToday = new Date(today.getTime() + 5.5 * 60 * 60 * 1000);
  
  if (
    ship.getUTCFullYear() === istToday.getUTCFullYear() &&
    ship.getUTCMonth() === istToday.getUTCMonth() &&
    ship.getUTCDate() === istToday.getUTCDate()
  ) {
    return "Ships Today";
  }
  return `Ships ${format(ship, "EEE, MMM d")}`;
}

/** "Delivers by Wed, Jun 19" */
export function deliveryDateLabel(): string {
  return `Delivers by ${format(getDeliveryDate(), "EEE, MMM d")}`;
}
