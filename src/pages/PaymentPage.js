import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './PaymentPage.css';
import Navbar from '../components/Navbar';
import { collection, addDoc, query, getDocs, where } from 'firebase/firestore';
import AuthContext from '../contexts/AuthContext';


function PaymentPage() {
    const { nannyId } = useParams();
    const [nanny, setNanny] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [error, setError] = useState('');
    const [voucherText, setVoucherText] = useState('Voucher');
    const { currentUser } = useContext(AuthContext);
    const [contract, setContract] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        fetchNanny();
        fetchContract();
        fetchPaymentStatus();
    }, [nannyId]);

    const fetchNanny = async () => {
        try {
            const docRef = doc(db, 'nannies', nannyId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setNanny(docSnap.data());
            } else {
                setError('Nanny not found!');
            }
        } catch (error) {
            console.error("Error fetching nanny:", error);
            setError('Failed to load nanny. Please try again later.');
        }
    }
     const fetchContract = async () => {
        try {
         const contractRef = doc(db, 'contracts', `${currentUser.uid}-${nannyId}`);
           const contractSnap = await getDoc(contractRef);
            if (contractSnap.exists()) {
                setContract(contractSnap.data());
            } else{
                setError("Contract not found")
            }
         }
         catch (error){
            console.log("Error fetching contract: ", error)
             setError('Failed to get contract info, try again later');
        }
    }
    const fetchPaymentStatus = async () => {
        try {
            const contractRef = doc(db, 'contracts', `${auth.currentUser.uid}-${nannyId}`);
            const contractSnap = await getDoc(contractRef);
            if (contractSnap.exists()) {
                const data = contractSnap.data();
                if (data.status === 'pending') {
                    setPaymentStatus('pending');
                } else if (data.status === 'completed') {
                    setPaymentStatus('completed');
                }
            }
            else {
                setError('Contract not found');
            }
        } catch (error) {
            console.error('Error getting contract payment status', error);
            setError('Failed to get payment status');
        }
    }
 const handleCompletePayment = async () => {
    if (!contract || !nanny) {
       setError("There is no contract or nanny to create a payment")
       return;
    }
      try {
            const paymentsCollection = collection(db, 'payments');
            await addDoc(paymentsCollection, {
                userId: auth.currentUser.uid,
                nannyId: nannyId,
                amount: '20$',
               date: new Date().toISOString(),
               contractId: `${currentUser.uid}-${nannyId}`,
                status: 'completed',
                nannyConfirmation: false,
            });
          const contractRef = doc(db, 'contracts', `${auth.currentUser.uid}-${nannyId}`);
           await setDoc(contractRef, { status: 'completed' }, { merge: true })
           setPaymentStatus('completed');
             try{
               navigate('/completed-vouchers');
             }
            catch (err){
                console.error("Error redirecting to completed vouchers", err);
            }
        } catch (error) {
             console.error("Error marking payment as completed:", error);
            setError("Failed to mark payment as complete. Please try again.");
       }
   };
    if (!nanny) {
        return <p>Loading payment page...</p>
    }
    if (error) {
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
                   {contract && <p>ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ: {new Date(contract?.startDate).toLocaleDateString()}</p>}
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
                <Link to='/history' className='go-history-button'>Go To History</Link>
                { currentUser?.email && currentUser?.email.includes('@gmail.com') === false &&  <Link to='/nanny-vouchers' className='nanny-vouchers-button'>Confirm Vouchers</Link> }
            </div>
        </>
    );
}

export default PaymentPage;