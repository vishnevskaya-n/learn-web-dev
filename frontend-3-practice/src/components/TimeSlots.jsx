export default function TimeSlots({ slots, selectedTime, onTimeClick }) {
  return (
    <div className="time-slots">
      <h2 className="time-slots-title">Время</h2>
      <div className="time-slots-grid">
        {slots.map(({ time, available }) => {
          const selected = selectedTime === time;
          const className = 'time-slot' + (!available ? ' unavailable' : '') + (selected ? ' selected' : '');
          return (
            <button key={time} type="button" className={className} disabled={!available} onClick={() => available && onTimeClick(time)}>
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}