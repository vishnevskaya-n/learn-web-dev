import { useState } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Footer from './components/Footer';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BottomPanel from './components/BottomPanel';
import { formatDateForPanel } from './utils/date';


const SLOTS = [
  { time: '10:00', available: true  },
  { time: '11:00', available: false },
  { time: '12:00', available: true  },
  { time: '13:00', available: false },
  { time: '14:00', available: true  },
  { time: '15:00', available: true  },
  { time: '16:00', available: true  },
  { time: '17:00', available: true  },
];

export default function App() {
 
  const [viewYear, setViewYear]     = useState(2026);
  const [viewMonth, setViewMonth]   = useState(10);                    
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 10, 23));
  const [selectedTime, setSelectedTime] = useState(null);


  const handlePrevMonth = () => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  
  const handleDayClick = (date) => {
    if (selectedDate && date.getTime() === selectedDate.getTime()) return;
    setSelectedDate(date);
    setSelectedTime(null); 
  };

  
  const handleTimeClick = (time) => {
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
              slots={SLOTS}
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