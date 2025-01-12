import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './HistoryPage.css';
import Navbar from '../components/Navbar';
import { formatDate } from '../utils/utils';

function HistoryPage() {
    const [contracts, setContracts] = useState([]);
    const [payments, setPayments] = useState([]);
     const [reviews, setReviews] = useState([]);
     const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
      fetchContracts();
      fetchPayments();
      fetchReviews();
   }, []);

    const fetchPayments = async () => {
         try{
           const paymentsSnapshot = await getDocs(query(collection(db, 'payments'), where('userId', '==', currentUser.uid)));
            const paymentsData = await Promise.all(paymentsSnapshot.docs.map(async (doc) => {
             const payment = { id: doc.id, ...doc.data() }
                const nannyDoc = await getDoc(doc(db, 'nannies', payment.nannyId));
             return {...payment, nannyName: nannyDoc.exists() ? nannyDoc.data().name : 'Unknown Nanny'}
            }));
            setPayments(paymentsData);
         }
         catch (error) {
            console.error('Error fetching payments:', error);
           setError('Failed to load payments, please try again later');
        }
    }

    const fetchReviews = async () => {
       try {
          const reviewsSnapshot = await getDocs(query(collection(db, 'reviews'), where('userId', '==', currentUser.uid)));
            const reviewsData = await Promise.all(reviewsSnapshot.docs.map(async (doc) => {
                const review = { id: doc.id, ...doc.data() }
                const nannyDoc = await getDoc(doc(db, 'nannies', review.nannyId));
                return {...review, nannyName: nannyDoc.exists() ? nannyDoc.data().name : 'Unknown Nanny'}
            }));
          setReviews(reviewsData);
        } catch (error){
             console.error("Error fetching reviews:", error);
            setError('Failed to load reviews, please try again later');
        }
    };

   const fetchContracts = async () => {
        try{
           const contractsSnapshot = await getDocs(query(collection(db, 'contracts'), where('userId', '==', currentUser.uid)));
             const contractsData = contractsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
             setContracts(contractsData);
        }
         catch(error){
           console.error('Error fetching contracts:', error);
          setError('Failed to load contracts, please try again later');
        }
    }
  if (error){
       return <p className="error-message">{error}</p>;
  }


  return (
    <>
        <Navbar />
    <div className="history-page">
        <h2>Ιστορικό</h2>
        <div className="history-container">
            <div className="history-section">
               <h3>Συμβόλαια</h3>
                  {contracts.length > 0 ? (
                contracts.map(contract => (
                  <div key={contract.id} className="history-card">
                    <p><strong>Ημερομηνία Έναρξης:</strong> {new Date(contract.startDate).toLocaleDateString()}</p>
                      <p><strong>Ημερομηνία Λήξης:</strong> {new Date(contract.endDate).toLocaleDateString()}</p>
                    <p><strong>Κατάσταση:</strong> {contract.status}</p>
                  </div>
               ))
                  ) : (
                <p>Δεν υπάρχει ιστορικό συμβολαίων.</p>
                 )}
            </div>
            <div className="history-section">
                <h3>Πληρωμές</h3>
                  {payments.length > 0 ? (
                        payments.map(payment => (
                       <div key={payment.id} className='payment-card'>
                         <p><strong>Ημερομηνία: </strong>{formatDate(payment.date)}</p>
                         <p><strong>Ποσό: </strong>{payment.amount}</p>
                            <p><strong>Nanny: </strong>{payment.nannyName}</p>
                           <p><strong>Κατάσταση: </strong>{payment.status}</p>
                       </div>
                      ))
                     ) : (
                       <p>No payment history available.</p>
                     )}
            </div>
          <div className="history-section">
                <h3>Αξιολογήσεις</h3>
             {reviews.length > 0 ? (
               reviews.map(review => (
                 <div key={review.id} className='review-card'>
                    <p><strong>Nanny: </strong>{review.nannyName}</p>
                      <p><strong>Rating: </strong> {review.rating}</p>
                      <p><strong>Comment: </strong> {review.reviewText}</p>
                </div>
                ))
            ) : (
              <p>No reviews</p>
           )}
          </div>
    </div>
  </div>
    </>
  );
}

export default HistoryPage;