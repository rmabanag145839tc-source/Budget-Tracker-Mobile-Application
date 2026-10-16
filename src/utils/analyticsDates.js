export function dateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// End is the first day AFTER the period. Comparing YYYY-MM-DD strings avoids timezone shifts.
export function analyticsPeriod(filter, offset, today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth();
  let start;
  let end;
  if (filter === 'week') {
    start = new Date(year, month, today.getDate());
    const daysSinceMonday = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - daysSinceMonday + offset * 7);
    end = new Date(start);
    end.setDate(end.getDate() + 7);
  } else if (filter === 'year') {
    start = new Date(year + offset, 0, 1);
    end = new Date(year + offset + 1, 0, 1);
  } else {
    const months = filter === 'threeMonths' ? 3 : 1;
    start = new Date(year, month + offset * months - months + 1, 1);
    end = new Date(year, month + offset * months + 1, 1);
  }
  return { start: dateKey(start), end: dateKey(end) };
}
