import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './VouchersPage.css';
import Navbar from '../components/Navbar';

function VouchersPage() {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState('');
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
        fetchPayments();
    }, []);


    const fetchPayments = async () => {
        try {
            const paymentsSnapshot = await getDocs(query(collection(db, 'payments'), where('userId', '==', currentUser.uid)));
            const paymentsData = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPayments(paymentsData);
          } catch (error) {
              console.error('Error fetching payments:', error);
              setError('Failed to load payments. Please try again later.');
           }
    };

   if (error){
        return <p className="error-message">{error}</p>;
   }
  return (
    <>
        <Navbar />
    <div className="vouchers-page">
      <h2>Ολοκληρωμένα Vouchers</h2>
     <div className="vouchers-container">
         {payments.length > 0 ? (
            payments.map(payment => (
                <div key={payment.id} className="voucher-card">
                    <p><strong>Ημερομηνία: </strong>{new Date(payment.date).toLocaleDateString()}</p>
                    <p><strong>Ποσό: </strong> {payment.amount}</p>
                    <p><strong>Συνεργάτης: </strong> {payment.nannyId}</p>
                </div>
              ))
         ) : (
            <p>Δεν υπάρχουν ολοκληρωμένα vouchers.</p>
         )}
    </div>
  </div>
    </>
 );
}

export default VouchersPage;