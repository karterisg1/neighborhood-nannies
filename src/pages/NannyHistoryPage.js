import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './NannyHistoryPage.css';
import Navbar from '../components/Navbar';
import { formatDate } from '../utils/utils';

function NannyHistoryPage() {
    const [payments, setPayments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchPayments();
        fetchReviews();
       fetchContracts();
    }, []);

   const fetchContracts = async () => {
      try{
        const contractsSnapshot = await getDocs(query(collection(db, 'contracts'), where('nannyId', '==', currentUser.uid)));
            const contractsData = await Promise.all(contractsSnapshot.docs.map(async doc => {
                const contract = { id: doc.id, ...doc.data() };
                const userDoc = await getDoc(doc(db, 'users', contract.userId));
              return {...contract, userName: userDoc.exists() ? userDoc.data().firstName + ' ' + userDoc.data().lastName : 'Άγνωστος Χρήστης'}
          }))
            setContracts(contractsData);
        }
        catch(error) {
         console.error('Σφάλμα κατά τη φόρτωση συμβάσεων:', error);
          setError('Αποτυχία φόρτωσης συμβάσεων, παρακαλώ προσπαθήστε ξανά αργότερα.');
     }
  }

    const fetchPayments = async () => {
        try {
            const paymentsSnapshot = await getDocs(query(collection(db, 'payments'), where('nannyId', '==', currentUser.uid)));
            const paymentsData = await Promise.all(paymentsSnapshot.docs.map(async (doc) => {
                const payment = { id: doc.id, ...doc.data() };
                const userDoc = await getDoc(doc(db, 'users', payment.userId));
                return { ...payment, userName: userDoc.exists() ? userDoc.data().firstName + " " + userDoc.data().lastName : 'Άγνωστος Χρήστης' };
            }));
            setPayments(paymentsData);
        } catch (error) {
            console.error('Σφάλμα κατά τη φόρτωση πληρωμών:', error);
            setError('Αποτυχία φόρτωσης πληρωμών, παρακαλώ προσπαθήστε ξανά αργότερα.');
        }
    };

    const fetchReviews = async () => {
        try {
            const reviewsSnapshot = await getDocs(query(collection(db, 'reviews'), where('nannyId', '==', currentUser.uid)));
            const reviewsData = await Promise.all(reviewsSnapshot.docs.map(async (doc) => {
                const review = { id: doc.id, ...doc.data() };
               const userDoc = await getDoc(doc(db, 'users', review.userId));
              return { ...review, userName: userDoc.exists() ? userDoc.data().firstName + " " + userDoc.data().lastName : 'Άγνωστος Χρήστης' };
           }));
            setReviews(reviewsData);
        } catch (error) {
            console.error("Σφάλμα κατά τη φόρτωση αξιολογήσεων:", error);
            setError('Αποτυχία φόρτωσης αξιολογήσεων, παρακαλώ προσπαθήστε ξανά αργότερα.');
        }
    };

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <>
            <Navbar />
            <div className="nanny-payment-history-page">
                <h2>Ιστορικό</h2>
                <div className="history-container">
                   <div className="history-section">
                        <h3>Συμβόλαια</h3>
                       {contracts.length > 0 ? (
                         contracts.map(contract => (
                             <div key={contract.id} className="contract-card">
                                  <p><strong>Ημερομηνία Έναρξης:</strong> {formatDate(contract.startDate)}</p>
                                   <p><strong>Ημερομηνία Λήξης:</strong> {formatDate(contract.endDate)}</p>
                                  <p><strong>Γονέας:</strong> {contract.userName} </p>
                                   <p><strong>Κατάσταση:</strong> {contract.status}</p>
                              </div>
                            ))
                      ) : (
                        <p>Δεν υπάρχει διαθέσιμο ιστορικό συμβολαίων.</p>
                   )}
               </div>
                    <div className="history-section">
                        <h3>Πληρωμές</h3>
                        {payments.length > 0 ? (
                            payments.map(payment => (
                                <div key={payment.id} className='payment-card'>
                                    <p><strong>Ημερομηνία Πληρωμής:</strong> {formatDate(payment.date)}</p>
                                    <p><strong>Ποσό:</strong> {payment.amount}</p>
                                   <p><strong>Γονέας: </strong> {payment.userName}</p>
                                    <p><strong>Κατάσταση:</strong> {payment.status}</p>
                                </div>
                            ))
                        ) : (
                            <p>Δεν υπάρχει διαθέσιμο ιστορικό πληρωμών.</p>
                        )}
                    </div>
                    <div className="history-section">
                        <h3>Αξιολογήσεις</h3>
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className='review-card'>
                                    <p><strong>Χρήστης: </strong> {review.userName}</p>
                                    <p><strong>Βαθμολογία: </strong> {review.rating}</p>
                                    <p><strong>Σχόλιο: </strong> {review.reviewText}</p>
                                </div>
                            ))
                        ) : (
                            <p>Χωρίς αξιολογήσεις</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default NannyHistoryPage;