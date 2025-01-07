import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './AppointmentManagementPage.css';
import Navbar from '../components/Navbar';

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
        let q = query(collection(db, 'appointments'), where('nannyId', '==', currentUser.uid))
         if (filterStatus !== 'all'){
           q = query(q, where('status', '==', filterStatus))
        }
         const querySnapshot = await getDocs(q);
         const appointmentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
                         </div>
                    </div>
                  ))
                )}
         </div>
       </>
    );
}

export default AppointmentManagementPage;