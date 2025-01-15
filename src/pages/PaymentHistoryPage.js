import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './PaymentHistoryPage.css';
import Navbar from '../components/Navbar';
import { formatDate } from '../utils/utils';

function PaymentHistoryPage() {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
      fetchPayments();
    }, []);

  const fetchPayments = async () => {
    try{
       const paymentsSnapshot = await getDocs(query(collection(db, 'payments'), where('userId', '==', currentUser.uid)));
        const paymentsData = await Promise.all(paymentsSnapshot.docs.map(async (doc) => {
         const payment = { id: doc.id, ...doc.data() };
           const nannyDoc = await getDoc(doc(db, 'nannies', payment.nannyId));
            return {...payment, nannyName: nannyDoc.exists() ? nannyDoc.data().name : 'Unknown Nanny'}
         }))
           setPayments(paymentsData);
       }
      catch (error){
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
    <div className="payment-history-page">
        <h2>Payment History</h2>
        <div className="payments-container">
            {payments.length > 0 ? (
                payments.map(payment => (
                  <div key={payment.id} className="payment-card">
                     <p><strong>Payment date:</strong> {formatDate(payment.date)}</p>
                      <p><strong>Amount:</strong> {payment.amount}</p>
                   <p><strong>Nanny:</strong> {payment.nannyName}</p>
                    <p><strong>Status:</strong> {payment.status}</p>
                  </div>
                ))
            ) : (
               <p>No payment history available.</p>
            )}
        </div>
     </div>
    </>
  );
}

export default PaymentHistoryPage;