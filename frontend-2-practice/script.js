// =========================================================
// 1. ДАННЫЕ

const SLOTS = [
    { time: "10:00", available: true  },
    { time: "11:00", available: false }, 
    { time: "12:00", available: true  },
    { time: "13:00", available: false }, 
    { time: "14:00", available: true  },
    { time: "15:00", available: true  },
    { time: "16:00", available: true  },
    { time: "17:00", available: true  }
];

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0); 

const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const MONTHS_GENITIVE = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const WEEKDAYS_SHORT = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
const WEEKDAYS_FULL  = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"];

// =========================================================
// 2. СОСТОЯНИЕ

const state = {
    viewYear: 2026,
    viewMonth: 10,        
    selectedDate: null,   
    selectedTime: null
};

// =========================================================
// 3. ЧИСТЫЕ ФУНКЦИИ

function buildCalendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; 
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const cells = [];
    
   
    for (let i = offset - 1; i >= 0; i--) {
        cells.push({ day: prevMonthLastDay - i, otherMonth: true });
    }
    
   
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, otherMonth: false });
    }
    
    
    const totalCells = Math.ceil(cells.length / 7) * 7;
    let nextDay = 1;
    while (cells.length < totalCells) {
        cells.push({ day: nextDay, otherMonth: true });
        nextDay++;
    }

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
}


function isTodayOrLater(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() >= TODAY.getTime();
}


function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}


function getWeekdayIndex(date) {
    const d = date.getDay();
    return d === 0 ? 6 : d - 1;
}


function formatDateForPanel(date) {
    const wd = WEEKDAYS_FULL[getWeekdayIndex(date)];
    return `${wd}, ${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
}

// =========================================================
// 4. ОТРИСОВКА И ОБРАБОТЧИКИ

const calendarTitle = document.getElementById('calendar-title');
const calendarGrid  = document.getElementById('calendar-grid');
const timeGrid      = document.getElementById('time-grid');
const selectionInfo = document.getElementById('selection-info');


function renderSelectionInfo() {
    if (!state.selectedDate) {
        selectionInfo.textContent = 'Выберите дату и время';
        selectionInfo.classList.add('is-empty');
        return;
    }
    const dateStr = formatDateForPanel(state.selectedDate);
    const timeStr = state.selectedTime || 'время не выбрано';
    selectionInfo.textContent = `${dateStr} • ${timeStr}`;
    selectionInfo.classList.remove('is-empty');
}


function renderCalendar() {
    const { viewYear, viewMonth } = state;
    calendarTitle.textContent = `${MONTHS[viewMonth]} ${viewYear}`.toUpperCase();

    const weeks = buildCalendarGrid(viewYear, viewMonth);
    let html = '';

    
    WEEKDAYS_SHORT.forEach(wd => {
        html += `<div class="weekday">${wd}</div>`;
    });

   
    weeks.forEach(week => {
        week.forEach(cell => {
            
            if (cell.otherMonth) {
                html += `<div class="day empty"></div>`;
                return;
            }

            const classes = ['day'];
            const cellDate = new Date(viewYear, viewMonth, cell.day);
            
            if (!isTodayOrLater(cellDate)) {
                classes.push('disabled');
            }
            
            
            if (state.selectedDate && isSameDay(cellDate, state.selectedDate)) {
                classes.push('selected');
            }

            const dataAttrs = `data-year="${viewYear}" data-month="${viewMonth}" data-day="${cell.day}"`;

            html += `<div class="${classes.join(' ')}" ${dataAttrs}>${cell.day}</div>`;
        });
    });

    calendarGrid.innerHTML = html;

    
    calendarGrid.querySelectorAll('.day:not(.empty):not(.disabled)')
        .forEach(cell => {
            cell.addEventListener('click', () => {
                const y = Number(cell.dataset.year);
                const m = Number(cell.dataset.month);
                const d = Number(cell.dataset.day);
                onDayClick(new Date(y, m, d));
            });
        });
}


function renderSlots() {
    timeGrid.innerHTML = '';

    if (!state.selectedDate) {
        const msg = document.createElement('p');
        msg.textContent = 'Сначала выберите дату';
        msg.style.gridColumn = '1 / -1';
        msg.style.textAlign = 'center';
        msg.style.color = '#999';
        timeGrid.appendChild(msg);
        return;
    }

    SLOTS.forEach(slot => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'time-btn';
        btn.textContent = slot.time;

        if (!slot.available) {
            btn.classList.add('disabled');
            btn.innerHTML = `${slot.time}<br><span>Занято</span>`;
            timeGrid.appendChild(btn);
            return;
        }

        if (state.selectedTime === slot.time) {
            btn.classList.add('selected');
        }
        
        btn.addEventListener('click', () => onTimeClick(slot.time));
        timeGrid.appendChild(btn);
    });
}


function onDayClick(date) {
    if (!isTodayOrLater(date)) return;
    if (state.selectedDate && isSameDay(date, state.selectedDate)) return;

    state.selectedDate = date;
    state.selectedTime = null; 

    renderCalendar();
    renderSlots();
    renderSelectionInfo();
}


function onTimeClick(time) {
    state.selectedTime = time;
    renderSlots();
    renderSelectionInfo();
}


function goToPrevMonth() {
    state.viewMonth -= 1;
    if (state.viewMonth < 0) { state.viewMonth = 11; state.viewYear -= 1; }
    renderCalendar();
}

function goToNextMonth() {
    state.viewMonth += 1;
    if (state.viewMonth > 11) { state.viewMonth = 0; state.viewYear += 1; }
    renderCalendar();
}

// =========================================================
// 5. ИНИЦИАЛИЗАЦИЯ

function init() {
    document.getElementById('prev-month').addEventListener('click', goToPrevMonth);
    document.getElementById('next-month').addEventListener('click', goToNextMonth);

    document.getElementById('confirm-btn').addEventListener('click', () => {
        if (!state.selectedDate || !state.selectedTime) {
            alert('Пожалуйста, выберите дату и время.');
            return;
        }
        alert(`Вы записаны на ${formatDateForPanel(state.selectedDate)} • ${state.selectedTime}`);
    });

    
    let defaultDate = new Date(2026, 10, 23);
    
    
    if (!isTodayOrLater(defaultDate)) {
        defaultDate = new Date(TODAY);
        state.viewYear = defaultDate.getFullYear();
        state.viewMonth = defaultDate.getMonth();
    }
    
    state.selectedDate = defaultDate;
    state.selectedTime = null;

   
    renderCalendar();
    renderSlots();
    renderSelectionInfo();
}


document.addEventListener('DOMContentLoaded', init);