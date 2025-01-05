import React, { useState } from 'react';
import './Calendar.css';
function Calendar({ onDateChange }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };
    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };
    const getMonthName = () => {
         return currentMonth.toLocaleDateString('el-GR', {month:'long', year: 'numeric'});
     };
    const handleDateClick = (day) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
       onDateChange(selectedDate);
    };

    const renderDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className='empty-day'></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
              <button key={`day-${day}`} className="calendar-day" onClick={() => handleDateClick(day)}>{day}</button>
            );
        }
        return days;
    };


  return (
     <div className="calendar">
         <div className="month-header">
             <button onClick={prevMonth}>&lt;</button>
             <span>{getMonthName()}</span>
             <button onClick={nextMonth}>&gt;</button>
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