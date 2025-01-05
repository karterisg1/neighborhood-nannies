import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './HistoryPage.css';
import Navbar from '../components/Navbar';

function HistoryPage() {
    const [contracts, setContracts] = useState([]);
     const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
      fetchContracts();
   }, []);

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
          {contracts.length > 0 ? (
                contracts.map(contract => (
                  <div key={contract.id} className="history-card">
                      <p><strong>Ημερομηνία Έναρξης:</strong> {new Date(contract.startDate).toLocaleDateString()}</p>
                      <p><strong>Ημερομηνία Λήξης:</strong> {new Date(contract.endDate).toLocaleDateString()}</p>
                     <p><strong>Κατάσταση:</strong> {contract.status}</p>
                  </div>
               ))
          ) : (
              <p>Δεν υπάρχει ιστορικό.</p>
          )}
    </div>
    </div>
    </>
  );
}

export default HistoryPage;