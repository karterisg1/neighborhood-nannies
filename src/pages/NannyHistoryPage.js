import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './NannyHistoryPage.css';
import Navbar from '../components/Navbar';
import { formatDate } from '../utils/utils';


function NannyHistoryPage() {
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const contractsSnapshot = await getDocs(query(collection(db, 'contracts'), where('nannyId', '==', currentUser.uid)));
      const contractsData = contractsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContracts(contractsData);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setError('Failed to load contracts, please try again later');
    }
  };
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
      <>
          <Navbar />
        <div className="nanny-history-page">
            <h2>My Contract History</h2>
          <div className="history-container">
            {contracts.length > 0 ? (
              contracts.map(contract => (
                  <div key={contract.id} className="history-card">
                      <p><strong>Start Date:</strong> {formatDate(contract.startDate)}</p>
                     <p><strong>End Date:</strong> {formatDate(contract.endDate)}</p>
                    <p><strong>Status:</strong> {contract.status}</p>
                  </div>
                ))
            ) : (
                <p>No contract history.</p>
            )}
      </div>
    </div>
      </>
  );
}

export default NannyHistoryPage;