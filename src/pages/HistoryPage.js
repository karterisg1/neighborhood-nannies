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
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        console.log('HistoryPage: useEffect triggered');
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log('HistoryPage: Fetching data for user:', currentUser.uid);
            await Promise.all([
                fetchContracts(),
                fetchPayments(),
                fetchReviews()
            ]);
            console.log('HistoryPage: All data fetched successfully');
        } catch (err) {
            console.error('HistoryPage: Error fetching data', err);
            setError('Failed to load contracts, payments, and reviews. Please try again later');
        } finally {
            setLoading(false);
        }
    };

    const fetchContracts = async () => {
        try {
            const contractsSnapshot = await getDocs(query(collection(db, 'contracts'), where('userId', '==', currentUser.uid)));
            const contractsData = contractsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setContracts(contractsData);
            console.log('HistoryPage: Contracts fetched successfully:', contractsData);
        } catch (error) {
            console.error('HistoryPage: Error fetching contracts:', error);
            setError('Failed to load contracts, please try again later');
        }
    };

    const fetchPayments = async () => {
        try {
            console.log("HistoryPage: fetching payments for user:", currentUser.uid);
            const paymentsSnapshot = await getDocs(query(collection(db, 'payments'), where('userId', '==', currentUser.uid)));
            const paymentsData = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPayments(paymentsData);
            console.log('HistoryPage: payments fetched successfully:', paymentsData);
        } catch (error) {
            console.error('HistoryPage: Error fetching payments:', error);
            setError('Failed to load payments, please try again later');
        }
    };

    const fetchReviews = async () => {
        try {
            console.log("HistoryPage: Fetching reviews for user: ", currentUser.uid);
            const reviewsQuery = query(collection(db, 'reviews'), where('userId', '==', currentUser.uid));
            const reviewsSnapshot = await getDocs(reviewsQuery);
            const reviewsData = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReviews(reviewsData);
            console.log("HistoryPage: Reviews fetched successfully:", reviewsData);
        } catch (error) {
            console.error('HistoryPage: Error fetching reviews:', error);
            setError('Failed to load reviews, please try again later');
        }
    };

    if (error) {
        return <p className="error-message">{error}</p>;
    }
    if (loading) {
        return <p>Loading history data...</p>;
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
