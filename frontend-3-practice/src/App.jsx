import { useState } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Footer from './components/Footer';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BottomPanel from './components/BottomPanel';
import { formatDateForPanel, isBeforeToday } from './utils/date';


function getSlotsForDate(date) {
  if (!date) return [];
  
  const dayOfWeek = date.getDay(); // 0 = Вс, 6 = Сб
  const dayOfMonth = date.getDate();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isEvenDay = dayOfMonth % 2 === 0;

  const baseSlots = [
    { time: '10:00' },
    { time: '11:00' },
    { time: '12:00' },
    { time: '13:00' },
    { time: '14:00' },
    { time: '15:00' },
    { time: '16:00' },
    { time: '17:00' },
  ];

 
  return baseSlots.map((slot) => {
    let available = true;
    if (slot.time === '11:00' && !isWeekend) available = false; 
    if (slot.time === '13:00' && isEvenDay) available = false;   
    return { ...slot, available };
  });
}

export default function App() {
  
  const today = new Date();

  const [viewYear, setViewYear]     = useState(today.getFullYear());
  const [viewMonth, setViewMonth]   = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(null);

 
  const currentSlots = getSlotsForDate(selectedDate);

  
  const handlePrevMonth = () => {
    setViewMonth((prev) => {
      let newMonth = prev - 1;
      if (newMonth < 0) {
        setViewYear((y) => y - 1);
        newMonth = 11;
      }
      return newMonth;
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => {
      let newMonth = prev + 1;
      if (newMonth > 11) {
        setViewYear((y) => y + 1);
        newMonth = 0;
      }
      return newMonth;
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // --- выбор дня ---
  const handleDayClick = (date) => {
    if (selectedDate && date.getTime() === selectedDate.getTime()) return;
    setSelectedDate(date);
    setSelectedTime(null); 
  };

  
  const handleTimeClick = (time) => {
    if (!selectedDate) {
      alert('Сначала выберите дату.');
      return;
    }
    if (isBeforeToday(selectedDate)) {
      alert('Нельзя записаться на прошедшую дату.');
      return;
    }
  
    if (
      selectedDate.getMonth() !== viewMonth ||
      selectedDate.getFullYear() !== viewYear
    ) {
      alert('Выбранная дата не относится к открытому месяцу.');
      return;
    }
    setSelectedTime(time);
  };

  
  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert('Пожалуйста, выберите дату и время.');
      return;
    }
    alert(`Вы записаны на ${formatDateForPanel(selectedDate)} • ${selectedTime}`);
  };

  return (
    <div className="App">
      <Header />

      <ProgressBar currentStep={4} totalSteps={5} />

      <main className="main-content">
        <div className="content-wrapper">
          <h1>ПОДТВЕРЖДЕНИЕ:</h1>

          <div className="cards-wrapper">
            <Calendar
              viewYear={viewYear}
              viewMonth={viewMonth}
              selectedDate={selectedDate}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <TimeSlots
              slots={currentSlots}
              selectedTime={selectedTime}
              onTimeClick={handleTimeClick}
            />
          </div>

          <BottomPanel
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onConfirm={handleConfirm}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}