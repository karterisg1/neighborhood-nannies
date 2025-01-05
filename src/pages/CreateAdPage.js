import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './CreateAdPage.css';
import Navbar from '../components/Navbar';


function CreateAdPage() {
  const [name, setName] = useState('');
    const [specialties, setSpecialties] = useState('');
    const [location, setLocation] = useState('');
    const [availability, setAvailability] = useState('');
    const [employment, setEmployment] = useState('ΠΛΗΡΗΣ/ΜΕΡΙΚΗ');
    const [error, setError] = useState('');
    const {currentUser} = useContext(AuthContext);
   const navigate = useNavigate();

   const handleEmploymentChange = (e) => {
     setEmployment(e.target.value);
   };

    const handleAdSubmission = async () => {
     try {
      const adsCollection = collection(db, 'ads');
       await addDoc(adsCollection, {
           name: name,
          nannyId: auth.currentUser.uid,
           specialties: specialties,
           location: location,
            availability: availability,
            employment: employment,
        });
       navigate('/nanny-dashboard');
        }
      catch (error){
          console.error('Error creating the ad:', error);
            setError('Failed to create the ad. Please try again later.');
       }
    };
      if (error){
        return <p className="error-message">{error}</p>;
      }
  return (
      <>
          <Navbar />
      <div className="create-ad-page">
          <h2>Δημιουργία Αγγελίας</h2>
      <div className="ad-form">
        <div className="form-group">
          <label htmlFor="name">Όνομα</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="specialties">Ειδικότητες</label>
          <input type="text" id="specialties" value={specialties} onChange={(e) => setSpecialties(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="location">Περιοχή Εξυπηρέτησης</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
          <div className="form-group">
              <label htmlFor="availability">Διαθεσιμότητα</label>
              <input type="text" id="availability" value={availability} onChange={(e) => setAvailability(e.target.value)} required />
          </div>
          <div className='form-group'>
             <label htmlFor='employment'>Απασχόληση</label>
            <select id='employment' value={employment} onChange={handleEmploymentChange}>
              <option value='ΠΛΗΡΗΣ/ΜΕΡΙΚΗ'>ΠΛΗΡΗΣ/ΜΕΡΙΚΗ</option>
               <option value='ΠΛΗΡΗΣ'>ΠΛΗΡΗΣ</option>
               <option value='ΜΕΡΙΚΗ'>ΜΕΡΙΚΗ</option>
            </select>
           </div>
       <div className="ad-buttons">
        <button onClick={handleAdSubmission} className='create-button'>Οριστική Υποβολή</button>
        <button onClick={() => navigate('/nanny-dashboard')} className='cancel-button'>Αποθήκευση</button>
      </div>
    </div>
      </div>
      </>
  );
}

export default CreateAdPage;