import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './NannyProfilePage.css';
import Navbar from '../components/Navbar';

function NannyProfilePage() {
    const { id } = useParams();
    const [nanny, setNanny] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchNanny();
    }, [id]);

    const fetchNanny = async () => {
        try {
           const docRef = doc(db, 'nannies', id);
           const docSnap = await getDoc(docRef);
           if(docSnap.exists()){
               setNanny(docSnap.data());
           } else {
              setError('Nanny not found!');
           }
        } catch (error){
            console.error('Error fetching nanny:', error);
            setError('Failed to load nanny. Please try again later.');
        }
    }


  if (!nanny) {
     return <p>Loading nanny details...</p>
  }
    if (error){
        return <p className="error-message">{error}</p>;
    }

  return (
    <>
      <Navbar />
       <div className="nanny-profile-page">
      <h2>{nanny.name}</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {nanny.email}</p>
        <p><strong>Τηλέφωνο:</strong> {nanny.phone}</p>
        <p><strong>Εμπειρία:</strong> {nanny.experience}</p>
        <p><strong>Σπουδές:</strong> {nanny.studies}</p>
        <p><strong>Φύλο:</strong> {nanny.gender}</p>
            {nanny.recommendationURL && <p><a href={nanny.recommendationURL} target='_blank' rel="noopener noreferrer">View Recommendation</a></p>}
      </div>
      <div className="profile-buttons">
          <Link to={`/booking/${id}`} className="book-button">Προγραμματισμός Ραντεβού</Link>
          <Link to={`/contract/${id}`} className='contract-button'>Αίτηση Συνεργασίας</Link>
           <Link to={`/nanny/${id}/full-profile`} className='full-profile-button'>Full Profile</Link>
      </div>
    </div>
    </>
  );
}

export default NannyProfilePage;