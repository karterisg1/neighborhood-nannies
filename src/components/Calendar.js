import React, { useState, useRef, useEffect } from 'react';
import './Calendar.css';

function Calendar({ onDateChange }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const calendarRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const getMonthName = () => {
        return currentMonth.toLocaleDateString('el-GR', { month: 'long', year: 'numeric' });
    };

    const handleDateClick = (day) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(selectedDate);
        onDateChange(selectedDate);
    };

    const renderDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className='empty-day'></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected = selectedDate && selectedDate.toDateString() === currentDate.toDateString();
            days.push(
                <button
                    key={`day-${day}`}
                    className={`calendar-day ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDateClick(day)}
                    role="button"
                    aria-label={`Ημερομηνία: ${currentDate.toLocaleDateString('el-GR')}`}
                    aria-selected={isSelected}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!calendarRef.current) return;

            const focusableElements = Array.from(
                calendarRef.current.querySelectorAll('button.calendar-day')
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            if (document.activeElement === calendarRef.current) {
                if (focusableElements.length > 0) {
                    firstFocusable.focus();
                }
                return;
            }

            if (!focusableElements.includes(document.activeElement)) return;

            const currentIndex = focusableElements.indexOf(document.activeElement);

            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                const nextIndex = (currentIndex === 0) ? focusableElements.length - 1 : currentIndex - 1;
                focusableElements[nextIndex].focus();
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                const nextIndex = (currentIndex === focusableElements.length - 1) ? 0 : currentIndex + 1;
                focusableElements[nextIndex].focus();
            } else if (event.key === 'Home') {
                event.preventDefault();
                firstFocusable.focus();
            } else if (event.key === 'End') {
                event.preventDefault();
                lastFocusable.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentMonth]);

    return (
        <div className="calendar" ref={calendarRef} tabIndex="0">
            <div className="month-header">
                <button onClick={prevMonth} aria-label="Προηγούμενος Μήνας">&lt;</button>
                <span aria-live="polite" aria-atomic="true">{getMonthName()}</span>
                <button onClick={nextMonth} aria-label="Επόμενος Μήνας">&gt;</button>
            </div>
            <div className="days-header">
                <span>Κυ</span>
                <span>Δε</span>
                <span>Τρ</span>
                <span>Τε</span>
                <span>Πε</span>
                <span>Πα</span>
                <span>Σα</span>
            </div>
            <div className="days-grid">
                {renderDays()}
            </div>
        </div>
    );
}

export default Calendar;
