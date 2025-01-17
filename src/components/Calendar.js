import React, { useState, useRef, useEffect } from 'react';
import './Calendar.css';

function Calendar({ onDateChange }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const calendarRef = useRef(null);

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    const prevMonth = () => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const getMonthName = () => {
        return currentMonth.toLocaleDateString('el-GR', { month: 'long', year: 'numeric' });
    };

    const handleDateClick = (day) => {
        const newSelectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newSelectedDate);
        onDateChange(newSelectedDate);
    };

    const renderDays = () => {
        const days = [];

        // Empty placeholders for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="empty-day"></div>);
        }

        // Render days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected =
                selectedDate && selectedDate.toDateString() === currentDate.toDateString();

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

            if (document.activeElement === calendarRef.current && focusableElements.length > 0) {
                firstFocusable.focus();
                return;
            }

            if (!focusableElements.includes(document.activeElement)) return;

            const currentIndex = focusableElements.indexOf(document.activeElement);

            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
                focusableElements[prevIndex].focus();
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                const nextIndex = currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1;
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
                <button onClick={prevMonth} aria-label="Προηγούμενος Μήνας">
                    &lt;
                </button>
                <span aria-live="polite" aria-atomic="true">
                    {getMonthName()}
                </span>
                <button onClick={nextMonth} aria-label="Επόμενος Μήνας">
                    &gt;
                </button>
            </div>
            <div className="days-header">
                {['Κυ', 'Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα'].map((day, index) => (
                    <span key={index}>{day}</span>
                ))}
            </div>
            <div className="days-grid">{renderDays()}</div>
        </div>
    );
}

export default Calendar;
