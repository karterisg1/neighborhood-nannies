import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './BalancePage.css';
import Navbar from '../components/Navbar';

function BalancePage() {
    const [payments, setPayments] = useState([]);
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchPayments();
    }, []);

   const fetchPayments = async () => {
        try{
            const paymentsSnapshot = await getDocs(query(collection(db, 'payments'), where('userId', '==', currentUser.uid)));
           const paymentsData = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPayments(paymentsData);
        }
     catch(error){
           console.error('Error fetching payments:', error);
          setError('Failed to load payments. Please try again later.');
       }
   };
     useEffect(() => {
       calculateBalance();
     }, [payments]);
   const calculateBalance = () => {
        let total = 0;
      payments.forEach(payment => {
          if (payment.status === 'completed'){
                total += parseFloat(payment.amount.replace('$', ''));
          }
       })
    setBalance(total);
  }

  if (error) {
        return <p className="error-message">{error}</p>;
   }

  return (
     <>
          <Navbar />
    <div className="balance-page">
      <h2>Your Balance</h2>
        <div className='balance-container'>
            <p>Your current balance is: ${balance}</p>
          </div>
    </div>
    </>
  );
}

export default BalancePage;