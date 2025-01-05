import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './ContractPage.css';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';


function ContractPage() {
    const { nannyId } = useParams();
    const [nanny, setNanny] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState('');
    const [contractText, setContractText] = useState('');
    const [agreement, setAgreement] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        fetchNanny();
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
      } catch (error) {
          console.error('Error fetching nanny:', error);
          setError('Failed to load nanny. Please try again later.');
      }
    };
     useEffect(() => {
         if (nanny) {
             setContractText(`Συμφωνητικό συνεργασίας μεταξύ του χρήστη ${auth.currentUser.displayName} και της νταντάς ${nanny.name} για το χρονικό διάστημα από ${startDate?.toLocaleDateString('el-GR')} έως ${endDate?.toLocaleDateString('el-GR')}`);
         }
    }, [nanny, startDate, endDate]);

     const handleStartDateChange = (date) => {
      setStartDate(date);
     };
    const handleEndDateChange = (date) => {
         setEndDate(date);
    };


    const handleAgreementChange = (e) => {
       setAgreement(e.target.checked);
    };

    const handleContractSubmission = async () => {
       if(!startDate || !endDate){
            setError('Παρακαλώ επιλέξτε μια περίοδο απασχόλησης.');
           return;
        }
        if(!agreement){
            setError('Παρακαλώ αποδεχτείτε το συμφωνητικό.');
            return;
        }
      try {
          const contractsCollection = doc(db, 'contracts', `${auth.currentUser.uid}-${nannyId}`);
            await setDoc(contractsCollection, {
               userId: auth.currentUser.uid,
               nannyId: nannyId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                contractText: contractText,
                status: 'pending',
           });
           navigate('/payment/' + nannyId);
        } catch(error){
            console.error('Error submitting contract:', error);
           setError('Failed to submit the contract. Please try again later.')
       }
    }


    if (!nanny) {
        return <p>Loading contract page...</p>
    }
    if (error) {
        return <p className="error-message">{error}</p>;
    }


  return (
    <>
        <Navbar />
      <div className="contract-page">
        <h2>Αίτηση Συνεργασίας</h2>
        <div className="contract-form">
           <div className="calendar-wrapper">
              <h3>Επιλέξτε ημερομηνία έναρξης και λήξης συνεργασίας</h3>
               <div className="calendar-container">
                <Calendar onDateChange={handleStartDateChange} />
                   <Calendar onDateChange={handleEndDateChange} />
               </div>
            </div>
          <div className="contract-text-container">
            <textarea value={contractText} readOnly/>
        </div>
        <div className="agreement-container">
            <label htmlFor="agreement">
             <input type='checkbox' id='agreement' checked={agreement} onChange={handleAgreementChange} />
             Έχω διαβάσει και κατανοήσει το συμφωνητικό.
            </label>
          <p><b>**Η υπογραφή σας είναι νομικά δεσμευτική**</b></p>
        </div>
           {error && <p className="error-message">{error}</p>}
          <div className="contract-buttons">
              <button onClick={handleContractSubmission} className="submit-contract-button">Υπογραφή Συμφωνητικού</button>
           </div>
      </div>
    </div>
    </>
  );
}

export default ContractPage;