import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './ContractPage.css';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';
import AuthContext from '../contexts/AuthContext';


function ContractPage() {
    const { nannyId } = useParams();
   const [nanny, setNanny] = useState(null);
    const [tempContract, setTempContract] = useState({
        startDate: null,
        endDate: null,
        contractText: '',
        agreement: false,
       status: 'draft', //initial status of the contract
   });
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNanny();
        fetchExistingContract();
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
    const fetchExistingContract = async () => {
        try{
            const contractRef = doc(db, 'contracts', `${auth.currentUser.uid}-${nannyId}`);
            const contractSnap = await getDoc(contractRef);
            if (contractSnap.exists()){
                setTempContract({id: contractSnap.id, ...contractSnap.data()})
           }
       }
      catch (error) {
            console.log("Error getting contract: ", error);
      }
    };

    useEffect(() => {
        if (nanny && tempContract.startDate && tempContract.endDate) {
            setTempContract(prev => ({
               ...prev,
               contractText: `Συμφωνητικό συνεργασίας μεταξύ του χρήστη ${auth.currentUser.displayName} και της νταντάς ${nanny.name} για το χρονικό διάστημα από ${tempContract.startDate?.toLocaleDateString('el-GR')} έως ${tempContract.endDate?.toLocaleDateString('el-GR')}`
           }));
        }
    }, [nanny, tempContract.startDate, tempContract.endDate]);


    const handleStartDateChange = (date) => {
         setTempContract(prev => ({ ...prev, startDate: date }));
     };
    const handleEndDateChange = (date) => {
         setTempContract(prev => ({ ...prev, endDate: date }));
    };


    const handleAgreementChange = (e) => {
          setTempContract(prev => ({ ...prev, agreement: e.target.checked }));
    };
  const handleSaveDraft = async () => {
        if(!tempContract.startDate || !tempContract.endDate){
            setError("Παρακαλώ επιλέξτε ημερομηνία");
           return;
      }
      try{
           const contractRef = doc(db, 'contracts', `${auth.currentUser.uid}-${nannyId}`);
            if(tempContract.id){
                await updateDoc(contractRef, {
                     startDate: tempContract.startDate.toISOString(),
                  endDate: tempContract.endDate.toISOString(),
                     contractText: tempContract.contractText,
                     status: 'draft',
                   });
            } else{
              await setDoc(contractRef, {
                  userId: auth.currentUser.uid,
                   nannyId: nannyId,
                 startDate: tempContract.startDate.toISOString(),
                 endDate: tempContract.endDate.toISOString(),
                 contractText: tempContract.contractText,
                 status: 'draft',
              });
           }
            setError("Draft Saved Successfully");
          }
       catch(error){
           setError('Failed to save draft. Please try again later.');
           console.error("Error saving draft: ", error);
       }
   };
    const handleContractSubmission = async () => {
       if(!tempContract.startDate || !tempContract.endDate){
          setError('Παρακαλώ επιλέξτε μια περίοδο απασχόλησης.');
           return;
       }
        if(!tempContract.agreement){
          setError('Παρακαλώ αποδεχτείτε το συμφωνητικό.');
           return;
       }
      try {
          const contractsCollection = doc(db, 'contracts', `${auth.currentUser.uid}-${nannyId}`);
            await setDoc(contractsCollection, {
               userId: auth.currentUser.uid,
               nannyId: nannyId,
                startDate: tempContract.startDate.toISOString(),
                endDate: tempContract.endDate.toISOString(),
                contractText: tempContract.contractText,
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
            <textarea value={tempContract.contractText} readOnly/>
        </div>
        <div className="agreement-container">
            <label htmlFor="agreement">
             <input type='checkbox' id='agreement' checked={tempContract.agreement} onChange={handleAgreementChange} />
             Έχω διαβάσει και κατανοήσει το συμφωνητικό.
            </label>
          <p><b>**Η υπογραφή σας είναι νομικά δεσμευτική**</b></p>
        </div>
          {error && <p className="error-message">{error}</p>}
          <div className="contract-buttons">
                {tempContract.status === "draft" && (
                  <button onClick={handleSaveDraft} className="save-draft-button">Αποθήκευση</button>
               )}
              <button onClick={handleContractSubmission} className="submit-contract-button">Υπογραφή Συμφωνητικού</button>
           </div>
      </div>
    </div>
    </>
  );
}

export default ContractPage;