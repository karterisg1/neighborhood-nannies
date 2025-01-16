import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './AppointmentManagementPage.css';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { generateChatId } from '../utils/utils';

function AppointmentManagementPage() {
   const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending');
    const {currentUser} = useContext(AuthContext);


    useEffect(() => {
        fetchAppointments();
    }, [filterStatus]);

  const fetchAppointments = async () => {
      try {
        let q = query(collection(db, 'appointments'), where('nannyId', '==', currentUser.uid));
         if (filterStatus !== 'all'){
           q = query(q, where('status', '==', filterStatus));
        }
          const querySnapshot = await getDocs(q);
            const appointmentData = await Promise.all(querySnapshot.docs.map(async (doc) => {
              const appointment = { id: doc.id, ...doc.data() };
               const userDoc = await getDoc(doc(db, 'users', appointment.userId))
              return {...appointment, userName: userDoc.exists() ? userDoc.data().firstName + " " + userDoc.data().lastName : 'Unknown User'}
            }))
         setAppointments(appointmentData);
        }
     catch(error) {
          console.error('Error fetching appointments', error);
         setError('Failed to load appointments. Please try again later.');
        }
    }

   const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    }


     const handleConfirmAppointment = async (appointmentId) => {
         try{
             const appointmentRef = doc(db, 'appointments', appointmentId);
            await updateDoc(appointmentRef, {status: 'confirmed'});
              setAppointments(appointments.map(app => {
                  if(app.id === appointmentId){
                    return {...app, status: 'confirmed'};
                  }
                  return app;
              }))
         }
       catch(error) {
           console.error("Error confirming appointment:", error);
          setError("Failed to confirm the appointment, please try again later");
       }
    };

    const handleRejectAppointment = async (appointmentId) => {
        try{
             const appointmentRef = doc(db, 'appointments', appointmentId);
            await updateDoc(appointmentRef, {status: 'rejected'});
              setAppointments(appointments.map(app => {
                  if(app.id === appointmentId){
                    return {...app, status: 'rejected'};
                 }
                return app;
             }))
       }
       catch(error) {
           console.error("Error rejecting appointment:", error);
           setError("Failed to reject the appointment, please try again later");
      }
    };
     if (error){
         return <p className="error-message">{error}</p>;
     }


    return (
        <>
            <Navbar />
        <div className="appointment-management-page">
             <h2>Διαχείριση Ραντεβού</h2>
              <div className="filter-section">
                <label htmlFor='statusFilter'>Φίλτρο Κατάστασης:</label>
                <select id='statusFilter' value={filterStatus} onChange={handleFilterChange}>
                   <option value='all'>Όλα</option>
                  <option value='pending'>Σε Εκκρεμότητα</option>
                  <option value='confirmed'>Επιβεβαιωμένο</option>
                 <option value='rejected'>Απορριφθηκε</option>
               </select>
              </div>
              {appointments.length === 0 ? (
                 <p>Δεν υπάρχουν προγραμματισμένα ραντεβού</p>
              ) : (
                 appointments.map(app => (
                    <div key={app.id} className="appointment-card">
                       <p><strong>User: </strong> {app.userName} ({app.userId})</p>
                         <p>Ημερομηνία: {new Date(app.date).toLocaleDateString()}</p>
                        <p>Ώρα: {app.time}</p>
                         <p>Τύπος: {app.type}</p>
                      <div className="appointment-buttons">
                         {app.status === 'pending' && (
                            <>
                             <button onClick={() => handleConfirmAppointment(app.id)} className='confirm-button'>Επιβεβαίωση</button>
                             <button onClick={() => handleRejectAppointment(app.id)} className='reject-button'>Απόρριψη</button>
                            </>
                          )}
                           {app.status === 'confirmed' && <p>Επιβεβαιωμένο</p>}
                            {app.status === 'rejected' && <p>Απορριφθηκε</p>}
                         <Link to={`/chat/${generateChatId(app.userId, currentUser.uid)}`} className="chat-button">Chat</Link>
                         </div>
                    </div>
                  ))
                )}
         </div>
       </>
    );
}

export default AppointmentManagementPage;