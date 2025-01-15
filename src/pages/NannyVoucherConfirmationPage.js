import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './NannyVoucherConfirmationPage.css';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
function NannyVoucherConfirmationPage() {
   const [payments, setPayments] = useState([]);
   const [error, setError] = useState('');
   const { currentUser } = useContext(AuthContext);


    useEffect(() => {
       fetchPayments();
   }, []);

 const fetchPayments = async () => {
     try{
         const paymentsSnapshot = await getDocs(query(collection(db, 'payments'), where('nannyId', '==', currentUser.uid)));
           const paymentsData = await Promise.all(paymentsSnapshot.docs.map(async (doc) => {
               const payment = { id: doc.id, ...doc.data() };
                const userDoc = await getDoc(doc(db, 'users', payment.userId));
                 return {...payment, userName: userDoc.exists() ? userDoc.data().firstName + " " + userDoc.data().lastName : 'Unknown User' }
           }));
          setPayments(paymentsData);
       }
    catch (error) {
          console.error('Error fetching payments:', error);
           setError('Failed to load payments, please try again later.');
     }
  };
    const handleConfirmVoucher = async (paymentId) => {
      try{
        const paymentRef = doc(db, 'payments', paymentId);
         await updateDoc(paymentRef, {nannyConfirmation: true});
          setPayments(payments.map(payment => {
             if(payment.id === paymentId){
               return {...payment, nannyConfirmation: true};
            }
            return payment;
          }))
        }
        catch(error){
           console.error('Error confirming voucher:', error);
           setError('Failed to confirm the voucher, please try again later');
     }
    }

    if(error) {
       return <p className="error-message">{error}</p>;
    }

  return (
    <>
        <Navbar />
    <div className="nanny-voucher-confirmation-page">
      <h2>Voucher Confirmation</h2>
        <div className="vouchers-container">
           {payments && payments.length > 0 ? (
            payments.map(payment => (
                 <div key={payment.id} className="voucher-card">
                   <p><strong>User:</strong> {payment.userName} ({payment.userId})</p>
                     <p><strong>Payment date:</strong>{new Date(payment.date).toLocaleDateString()}</p>
                    <p><strong>Amount:</strong> {payment.amount}</p>
                    <p><strong>Status:</strong> {payment.status}</p>
                     {payment.nannyConfirmation === false ?
                         <button onClick={() => handleConfirmVoucher(payment.id)} className='confirm-button'>Confirm Voucher</button>
                       :
                     <p>Confirmed</p>}
                </div>
            ))
            ) : (
                <p>No vouchers.</p>
            )}
        </div>
         <Link to='/payment-history' className="payment-history-button">Go To Payment History</Link>
    </div>
      </>
  );
}

export default NannyVoucherConfirmationPage;