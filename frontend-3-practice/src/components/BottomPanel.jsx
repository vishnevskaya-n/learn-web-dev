import { formatDateForPanel } from '../utils/date';

export default function BottomPanel({ selectedDate, selectedTime, onConfirm }) {
  return (
    <div className="bottom-section">
      {/* Белая карточка с текстом */}
      <div className="bottom-card">
        <div className="bottom-label">ВАША ЗАПИСЬ</div>
        <div className="bottom-value">
          {selectedDate ? formatDateForPanel(selectedDate) : 'Дата не выбрана'} 
          {selectedTime ? ` • ${selectedTime}` : ' • время не выбрано'}
        </div>
      </div>

      {/* Кнопка ПОДТВЕРДИТЬ */}
      <button type="button" className="confirm-btn" onClick={onConfirm}>
        ПОДТВЕРДИТЬ
      </button>
    </div>
  );
}