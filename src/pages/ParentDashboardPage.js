import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './ParentDashboardPage.css';
import Navbar from '../components/Navbar';

function ParentDashboardPage() {
    const [contracts, setContracts] = useState([]);
    const [error, setError] = useState('');
     const { currentUser } = useContext(AuthContext);

    useEffect(() => {
      fetchContracts();
    }, []);


  const fetchContracts = async () => {
       try {
          const contractsSnapshot = await getDocs(query(collection(db, 'contracts'), where('userId', '==', currentUser.uid)));
           const contractsData = contractsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setContracts(contractsData);
        }
        catch(error){
            console.error('Error fetching contracts', error);
           setError('Failed to load contracts, please try again later');
        }
   };
   if (error){
      return <p className="error-message">{error}</p>;
  }


  return (
      <>
          <Navbar />
    <div className="parent-dashboard-page">
      <h2>Parent Dashboard</h2>
        <div className="contracts-section">
            <h3>Ongoing Contracts</h3>
           {contracts.length > 0 ? (
                contracts.map(contract => (
                  <div key={contract.id} className="contract-card">
                    <p><strong>Contract with:</strong> {contract.nannyId}</p>
                     <p><strong>Start Date:</strong> {new Date(contract.startDate).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {contract.status}</p>
                </div>
             ))
              ) : (
                  <p>No ongoing contracts at the moment.</p>
             )}
        </div>

      <div className="dashboard-section">
        <h3>Other Links</h3>
            <ul>
                <li><a href='/search-nannies'>Find Nannies</a></li>
               <li><a href='/notifications'>View Notifications</a></li>
            </ul>
        </div>
    </div>
    </>
  );
}

export default ParentDashboardPage;