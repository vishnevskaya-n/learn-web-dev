const WEEKDAYS_FULL = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота'
];

const MONTH_NAMES_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export function formatDateForPanel(date) {
  if (!date) return '';
  const weekday = WEEKDAYS_FULL[date.getDay()];
  return `${weekday}, ${date.getDate()} ${MONTH_NAMES_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isBeforeToday(date) {
  const today = new Date();
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return d.getTime() < t.getTime();
}

export function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const offset = (firstOfMonth.getDay() + 6) % 7; 
  const grid = [];
  for (let i = 0; i < offset; i += 1) grid.push(null);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d += 1) grid.push(new Date(year, month, d));
  while (grid.length < 42) grid.push(null);
  return grid;
}