import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './CompletedVouchersPage.css';
import Navbar from '../components/Navbar';

function CompletedVouchersPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
         fetchPayments();
    }, []);


    const fetchPayments = async () => {
      setLoading(true);
        try {
             console.log("CompletedVouchersPage: Fetching payments started for user id: ", currentUser.uid);
             const paymentsSnapshot = await getDocs(query(collection(db, 'payments'), where('userId', '==', currentUser.uid)));
             const paymentsData = await Promise.all(paymentsSnapshot.docs.map(async (doc) => {
                const payment = { id: doc.id, ...doc.data() };
                console.log("CompletedVouchersPage: Fetched payment data:", payment);
               try{
                   const nannyDoc = await getDoc(doc(db, 'nannies', payment.nannyId));
                     const nannyName = nannyDoc.exists() ? nannyDoc.data().name : 'Unknown Nanny';
                     console.log("CompletedVouchersPage: Fetched nanny name for id:", payment.nannyId, " Name:", nannyName);
                     return { ...payment, nannyName: nannyName };
                 }
                  catch (fetchNannyError) {
                   console.error('CompletedVouchersPage: Error fetching nanny data for ID:', payment.nannyId, fetchNannyError);
                   return { ...payment, nannyName: 'Error - Unable to Fetch Nanny Name'};
                }
             }));
           setPayments(paymentsData);
              setLoading(false)
              console.log("CompletedVouchersPage: All data fetched correctly:", paymentsData);
          } catch (error) {
              console.error('CompletedVouchersPage: Error fetching payments:', error);
              setError('Failed to load payments. Please try again later.');
               setLoading(false)
           }
    };

   if (error){
        return <p className="error-message">{error}</p>;
   }
  if(loading) {
        return <p>Loading completed vouchers...</p>;
    }
  return (
    <>
        <Navbar />
    <div className="completed-vouchers-page">
      <h2>Ολοκληρωμένα Vouchers</h2>
     <div className="vouchers-container">
         {payments.length > 0 ? (
            payments.map(payment => (
                <div key={payment.id} className="voucher-card">
                    <p><strong>Ημερομηνία: </strong>{new Date(payment.date).toLocaleDateString()}</p>
                    <p><strong>Ποσό: </strong> {payment.amount}</p>
                    <p><strong>Συνεργάτης: </strong> {payment.nannyName}</p>
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

export default CompletedVouchersPage;