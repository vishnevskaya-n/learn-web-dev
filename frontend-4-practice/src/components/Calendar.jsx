import { buildMonthGrid, isSameDay, isBeforeToday } from '../utils/date';

const MONTH_NAMES = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function Calendar({ viewYear, viewMonth, selectedDate, onDayClick, onPrevMonth, onNextMonth }) {
  const grid = buildMonthGrid(viewYear, viewMonth);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button type="button" className="calendar-arrow" onClick={onPrevMonth}>‹</button>
        <div className="calendar-title">{MONTH_NAMES[viewMonth]} {viewYear}</div>
        <button type="button" className="calendar-arrow" onClick={onNextMonth}>›</button>
      </div>
      <div className="calendar-weekdays">
        {WEEKDAYS.map((wd) => <div key={wd} className="calendar-weekday">{wd}</div>)}
      </div>
      <div className="calendar-grid">
        {grid.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} className="calendar-cell empty" />;
          const disabled = isBeforeToday(date);
          const selected = selectedDate && isSameDay(date, selectedDate);
          const className = 'calendar-cell' + (disabled ? ' disabled' : '') + (selected ? ' selected' : '');
          return (
            <button key={date.toISOString()} type="button" className={className} disabled={disabled} onClick={() => onDayClick(date)}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}