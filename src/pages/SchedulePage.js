import React, { useState, useEffect } from 'react';
import './SchedulePage.css';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';

function SchedulePage() {
     const [selectedDays, setSelectedDays] = useState([]);
     const handleDateChange = (date) => {
         setSelectedDays(date);
   }
  return (
      <>
          <Navbar />
      <div className="schedule-page">
            <h2>Manage Your Schedule</h2>
            <div className='calendar-container'>
                <Calendar onDateChange={handleDateChange} />
            </div>
      </div>
      </>
  );
}

export default SchedulePage;