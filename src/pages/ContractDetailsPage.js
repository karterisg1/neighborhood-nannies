import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './ContractDetailsPage.css';
import Navbar from '../components/Navbar';
import { formatDate } from '../utils/utils';

function ContractDetailsPage() {
    const { id } = useParams();
    const [contract, setContract] = useState(null);
    const [error, setError] = useState('');


    useEffect(() => {
        fetchContract();
    }, [id]);
    const fetchContract = async () => {
        try {
            const docRef = doc(db, 'contracts', id);
           const docSnap = await getDoc(docRef);
           if(docSnap.exists()){
              setContract(docSnap.data());
          } else {
              setError('Contract not found!');
           }
       } catch (error){
           console.error('Error fetching contract:', error);
          setError('Failed to load the contract. Please try again later');
       }
    };
     if (!contract) {
         return <p>Loading contract details...</p>
      }
     if(error){
          return <p className="error-message">{error}</p>;
      }
    return (
        <>
            <Navbar />
      <div className="contract-details-page">
        <h2>Contract Details</h2>
          <div className="contract-info">
              <p><strong>User ID:</strong> {contract.userId}</p>
              <p><strong>Nanny ID:</strong> {contract.nannyId}</p>
             <p><strong>Start Date:</strong> {formatDate(contract.startDate)}</p>
              <p><strong>End Date:</strong> {formatDate(contract.endDate)}</p>
             <p><strong>Status:</strong> {contract.status}</p>
            <div className='contract-text'>
                   <p><strong>Contract Text:</strong></p>
               <textarea value={contract.contractText} readOnly />
          </div>
         </div>
    </div>
        </>
    );
}

export default ContractDetailsPage;