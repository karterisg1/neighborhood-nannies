import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './PaymentPage.css';
import Navbar from '../components/Navbar';
import { collection, addDoc } from 'firebase/firestore';


function PaymentPage() {
    const { nannyId } = useParams();
    const [nanny, setNanny] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [error, setError] = useState('');
    const [voucherText, setVoucherText] = useState('Voucher');
     const navigate = useNavigate();

     useEffect(() => {
       fetchNanny();
      fetchPaymentStatus();
     }, [nannyId]);

    const fetchNanny = async () => {
         try {
            const docRef = doc(db, 'nannies', nannyId);
           const docSnap = await getDoc(docRef);
           if(docSnap.exists()){
              setNanny(docSnap.data());
             } else {
              setError('Nanny not found!');
           }
        } catch (error){
            console.error("Error fetching nanny:", error);
            setError('Failed to load nanny. Please try again later.');
        }
    }
      const fetchPaymentStatus = async () => {
       try {
          const contractRef = doc(db, 'contracts', `${auth.currentUser.uid}-${nannyId}`);
           const contractSnap = await getDoc(contractRef);
            if(contractSnap.exists()){
                const data = contractSnap.data();
             if (data.status === 'pending'){
               setPaymentStatus('pending');
              } else if (data.status === 'completed'){
                setPaymentStatus('completed');
              }
            }
           else {
                setError('Contract not found');
            }
        } catch (error){
            console.error('Error getting contract payment status', error);
             setError('Failed to get payment status');
        }
     }

     const handleCompletePayment = async () => {
        try {
            const paymentsCollection = collection(db, 'payments');
           await addDoc(paymentsCollection, {
              userId: auth.currentUser.uid,
             nannyId: nannyId,
               amount: '20$',
                date: new Date().toISOString(),
               status: 'completed',
            });
          const contractRef = doc(db, 'contracts', `${auth.currentUser.uid}-${nannyId}`);
            await setDoc(contractRef, {status: 'completed'}, {merge: true})
           setPaymentStatus('completed');
           navigate('/completed-vouchers');
        } catch (error) {
             console.error("Error marking payment as completed:", error);
            setError("Failed to mark payment as complete. Please try again.");
       }
   };
     if (!nanny) {
       return <p>Loading payment page...</p>
     }
    if (error){
      return <p className="error-message">{error}</p>;
   }

    return (
    <>
        <Navbar />
       <div className="payment-page">
         <h2>Πληρωμή & Παρακολούθηση Εργασίας</h2>
          <div className="payment-status-section">
              <div className="voucher-container">
                <p><strong>{voucherText}</strong></p>
                <p>Η εργασία ολοκληρώθηκε επιτυχώς.</p>
              </div>

          </div>
           <div className='payment-info'>
               <h3>10/11/2024</h3>
               <p>ΟΝΟΜΑ ΕΠΙΜΕΛΗΤΗ: {nanny.name}</p>
               {paymentStatus === 'pending' ?
               <p>ΑΝΑΜΕΝΕΤΑΙ</p>
               :
               <p>ΕΠΙΒΕΒΑΙΩΜΕΝΟ</p>
              }
              <p>ΠΟΣΟ: 20$</p>
          </div>
           {paymentStatus === 'pending' && (
           <button onClick={handleCompletePayment} className='complete-payment-button'>ΟΛΟΚΛΗΡΩΣΗ</button>
           )}
      </div>
    </>
  );
}

export default PaymentPage;