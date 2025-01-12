import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './CreateAdPage.css';
import Navbar from '../components/Navbar';


function CreateAdPage() {
  const [name, setName] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
    const [availabilityDays, setAvailabilityDays] = useState([]);
    const [employment, setEmployment] = useState('ΠΛΗΡΗΣ/ΜΕΡΙΚΗ');
    const [error, setError] = useState('');
    const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckboxChange = (day) => {
      if (availabilityDays.includes(day)) {
            setAvailabilityDays(availabilityDays.filter((d) => d !== day));
        } else {
           setAvailabilityDays([...availabilityDays, day]);
        }
    };


   const handleEmploymentChange = (e) => {
     setEmployment(e.target.value);
   };

    const handleAdSubmission = async () => {
     try {
      const adsCollection = collection(db, 'ads');
        const userRef =  doc(db, 'users', auth.currentUser.uid)
      await addDoc(adsCollection, {
           name: name,
            nannyId: auth.currentUser.uid,
           specialties: specialties,
            location: location,
            availability: availability,
             employment: employment,
        });
        const nanniesCollection = collection(db, 'nannies');
         await addDoc(nanniesCollection, {
             name: name,
               email: currentUser.email,
                 userId: auth.currentUser.uid,
                specialties: specialties,
                location: location,
                  availability: availability,
                employment: employment,
               availabilityDays: availabilityDays,
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
             <div className="form-group">
                <label>Availability Days:</label>
                <div className="checkbox-group">
                    <label><input type="checkbox" value="Monday" checked={availabilityDays.includes('Monday')} onChange={() => handleCheckboxChange('Monday')} />Monday</label>
                   <label><input type="checkbox" value="Tuesday" checked={availabilityDays.includes('Tuesday')} onChange={() => handleCheckboxChange('Tuesday')} />Tuesday</label>
                   <label><input type="checkbox" value="Wednesday" checked={availabilityDays.includes('Wednesday')} onChange={() => handleCheckboxChange('Wednesday')} />Wednesday</label>
                    <label><input type="checkbox" value="Thursday" checked={availabilityDays.includes('Thursday')} onChange={() => handleCheckboxChange('Thursday')} />Thursday</label>
                    <label><input type="checkbox" value="Friday" checked={availabilityDays.includes('Friday')} onChange={() => handleCheckboxChange('Friday')} />Friday</label>
                   <label><input type="checkbox" value="Saturday" checked={availabilityDays.includes('Saturday')} onChange={() => handleCheckboxChange('Saturday')} />Saturday</label>
                  <label><input type="checkbox" value="Sunday" checked={availabilityDays.includes('Sunday')} onChange={() => handleCheckboxChange('Sunday')} />Sunday</label>
                </div>
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