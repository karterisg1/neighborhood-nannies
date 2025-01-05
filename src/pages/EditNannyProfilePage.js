import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, getDocs, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './EditNannyProfilePage.css';
import Navbar from '../components/Navbar';


function EditNannyProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [experience, setExperience] = useState('');
    const [studies, setStudies] = useState('');
    const [gender, setGender] = useState('');
    const [specialties, setSpecialties] = useState('');
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
       fetchNannyProfile();
    }, []);

    const fetchNannyProfile = async () => {
        try {
          const querySnapshot = await getDocs(query(collection(db, 'nannies'), where('userId', '==', currentUser.uid)))
          const fetchedNannies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (fetchedNannies.length > 0) {
            const nanny = fetchedNannies[0];
            setName(nanny.name);
            setEmail(nanny.email);
            setPhone(nanny.phone);
            setExperience(nanny.experience);
            setStudies(nanny.studies);
              setGender(nanny.gender);
              setSpecialties(nanny.specialties);
        }
        }
        catch (error) {
            console.error('Error fetching nanny profile:', error);
            setError('Failed to load nanny profile. Please try again later.');
         }
    };

    const handleUpdateProfile = async () => {
        try {
            const querySnapshot = await getDocs(query(collection(db, 'nannies'), where('userId', '==', currentUser.uid)))
            const fetchedNannies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           if (fetchedNannies.length > 0) {
               const nannyDocRef = doc(db, 'nannies', fetchedNannies[0].id);
               await updateDoc(nannyDocRef, {
                    name: name,
                    email: email,
                   phone: phone,
                   experience: experience,
                    studies: studies,
                    gender: gender,
                    specialties: specialties
              });
           }
            navigate('/nanny-dashboard');
         } catch (error) {
             console.error('Error updating nanny profile:', error);
           setError('Failed to update nanny profile. Please try again later.');
        }
   };

   if (error){
    return <p className="error-message">{error}</p>;
   }

  return (
    <>
        <Navbar />
    <div className="edit-nanny-profile-page">
        <h2>Επεξεργασία Προφίλ</h2>
      <div className="nanny-form">
          <div className="form-group">
            <label htmlFor="name">Όνομα</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
         </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
        <div className="form-group">
          <label htmlFor="phone">Τηλέφωνο</label>
          <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="experience">Εμπειρία</label>
          <input type="text" id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="studies">Σπουδές</label>
          <input type="text" id="studies" value={studies} onChange={(e) => setStudies(e.target.value)} />
        </div>
        <div className="form-group">
            <label htmlFor="gender">Φύλο</label>
             <input type="text" id='gender' value={gender} onChange={(e) => setGender(e.target.value)}/>
          </div>
         <div className="form-group">
          <label htmlFor="specialties">Ειδικότητες</label>
           <input type='text' id='specialties' value={specialties} onChange={(e) => setSpecialties(e.target.value)}/>
         </div>
           <div className="form-buttons">
              <button onClick={handleUpdateProfile} className='update-button'>Αποθήκευση</button>
              <button onClick={() => navigate('/nanny-dashboard')} className="cancel-button">Άκυρωση</button>
          </div>
      </div>
    </div>
    </>
  );
}

export default EditNannyProfilePage;