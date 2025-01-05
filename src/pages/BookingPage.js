import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingPage.css';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function BookingPage() {
    const { nannyId } = useParams();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [type, setType] = useState('ΔΙΑ ΖΩΣΗΣ');
    const [error, setError] = useState('');
    const navigate = useNavigate();

   const times = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30'];


   const handleDateChange = (date) => {
        setSelectedDate(date);
   };
   const handleTimeChange = (time) => {
        setSelectedTime(time);
   };
    const handleTypeChange = (e) => {
        setType(e.target.value);
    }

    const handleBooking = async () => {
        if(!selectedDate || !selectedTime){
          setError('Παρακαλώ επιλέξτε ημερομηνία και ώρα.');
          return;
        }
         try {
            const appointmentsCollection = collection(db, 'appointments');
            await addDoc(appointmentsCollection, {
                nannyId: nannyId,
                userId: auth.currentUser.uid,
                date: selectedDate.toISOString(),
                time: selectedTime,
                type: type,
                status: 'pending'
           });
            navigate('/manage-appointments');
           }
         catch (error){
             console.error("Error booking appointment:", error);
             setError('Failed to book the appointment. Please try again later.')
         }
    };

  return (
    <>
        <Navbar />
    <div className="booking-page">
      <h2>Προγραμματισμός Ραντεβού</h2>
        {error && <p className="error-message">{error}</p>}
        <Calendar onDateChange={handleDateChange} />

      <div className="time-selection">
        <h3>Επιλογή Ώρας</h3>
            {times.map((time, index) => (
                <button
                    key={index}
                    className={`time-button ${selectedTime === time ? 'active' : ''}`}
                    onClick={() => handleTimeChange(time)}
                >
                    {time}
                </button>
                ))}
      </div>

        <div className="type-selection">
             <h3>Επιλέξτε Τρόπο Ραντεβού</h3>
            <label>
               <input type='radio' name='type' value='ΔΙΑ ΖΩΣΗΣ' checked={type === 'ΔΙΑ ΖΩΣΗΣ'} onChange={handleTypeChange} />
                ΔΙΑ ΖΩΣΗΣ
            </label>
            <label>
               <input type='radio' name='type' value='ΕΞ ΑΠΟΣΤΑΣΕΩΣ' checked={type === 'ΕΞ ΑΠΟΣΤΑΣΕΩΣ'} onChange={handleTypeChange} />
                ΕΞ ΑΠΟΣΤΑΣΕΩΣ
            </label>
        </div>

      <button onClick={handleBooking} className="book-appointment-button">Κλείσιμο Ραντεβού</button>
    </div>
    </>
  );
}

export default BookingPage;