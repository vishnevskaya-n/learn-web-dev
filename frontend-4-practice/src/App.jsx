import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Footer from './components/Footer';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BottomPanel from './components/BottomPanel';
import { formatDateForPanel } from './utils/date';
import { fetchToday, fetchSlots } from './api';

export default function App() {
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  useEffect(() => {
    async function loadToday() {
      try {
        setTodayLoading(true);
        setTodayError(null);
        const data = await fetchToday();
        
        const initialDate = new Date(data.year, data.month, data.day);
        setViewYear(data.year);
        setViewMonth(data.month);
        setSelectedDate(initialDate);
      } catch (err) {
        setTodayError(err.message);
      } finally {
        setTodayLoading(false);
      }
    }
    loadToday();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    async function loadSlots() {
      try {
        setSlotsLoading(true);
        setSlotsError(null);
        const dateObj = {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth(),
          year: selectedDate.getFullYear(),
        };
        const data = await fetchSlots(dateObj);
        setSlots(data.slots);
      } catch (err) {
        setSlotsError(err.message);
      } finally {
        setSlotsLoading(false);
      }
    }
    loadSlots();
  }, [selectedDate]);

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

  const handleDayClick = (date) => {
    if (selectedDate && date.getTime() === selectedDate.getTime()) return;
    setSelectedDate(date);
    setSelectedTime(null); 
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert('Пожалуйста, выберите дату и время.');
      return;
    }
    alert(`Вы записаны на ${formatDateForPanel(selectedDate)} • ${selectedTime}`);
  };

  if (todayLoading) return <div className="status-screen">Загрузка данных...</div>;
  if (todayError) return <div className="status-screen error">Ошибка: {todayError}</div>;

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
            
            {slotsLoading ? (
              <div className="time-slots loading">Загрузка времени...</div>
            ) : slotsError ? (
              <div className="time-slots error">Ошибка: {slotsError}</div>
            ) : (
              <TimeSlots
                slots={slots}
                selectedTime={selectedTime}
                onTimeClick={setSelectedTime}
              />
            )}
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