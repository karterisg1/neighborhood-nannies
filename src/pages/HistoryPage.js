import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './HistoryPage.css';
import Navbar from '../components/Navbar';

function HistoryPage() {
    const [contracts, setContracts] = useState([]);
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);
    const [filterStatus, setFilterStatus] = useState('all');


    useEffect(() => {
        fetchContracts();
    }, [filterStatus]);

    const fetchContracts = async () => {
        try {
            let q = query(collection(db, 'contracts'), where('userId', '==', currentUser.uid));
            if (filterStatus !== 'all') {
              q = query(q, where('status', '==', filterStatus));
            }
            const contractsSnapshot = await getDocs(q);
            const contractsData = await Promise.all(contractsSnapshot.docs.map(async (doc) => {
              const contract = { id: doc.id, ...doc.data() };
               const nannyDoc = await getDoc(doc(db, 'nannies', contract.nannyId));
                return {...contract, nannyName: nannyDoc.exists() ? nannyDoc.data().name : 'Unknown Nanny'}
           }))
           setContracts(contractsData);
        }
        catch (error) {
            console.error('Error fetching contracts:', error);
            setError('Failed to load contracts, please try again later');
        }
    }
    const handleStatusFilterChange = (e) => {
     setFilterStatus(e.target.value);
    };


    if (error) {
        return <p className="error-message">{error}</p>;
    }


    return (
        <>
            <Navbar />
            <div className="history-page">
                <h2>Ιστορικό</h2>
             <div className="filter-section">
                <label htmlFor='statusFilter'>Φίλτρο Κατάστασης:</label>
                <select id='statusFilter' value={filterStatus} onChange={handleStatusFilterChange}>
                   <option value='all'>Όλα</option>
                  <option value='pending'>Σε Εκκρεμότητα</option>
                  <option value='completed'>Ολοκληρωμένο</option>
                 <option value='ended'>Ληγμένο</option>
               </select>
              </div>
                <div className="history-container">
                    {contracts.length > 0 ? (
                        contracts.map(contract => (
                            <div key={contract.id} className="history-card">
                                <p><strong>Ημερομηνία Έναρξης:</strong> {new Date(contract.startDate).toLocaleDateString()}</p>
                                <p><strong>Ημερομηνία Λήξης:</strong> {new Date(contract.endDate).toLocaleDateString()}</p>
                                <p><strong>Κατάσταση:</strong> {contract.status}</p>
                                <p><strong>Νταντά:</strong> {contract.nannyName}</p>
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