import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './EditProfilePage.css';
import Navbar from '../components/Navbar';


function EditProfilePage() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
         try {
            const userRef = doc(db, 'users', currentUser.uid);
           const userSnap = await getDoc(userRef);
           if(userSnap.exists()){
              const data = userSnap.data();
              setName(data.firstName);
              setLastName(data.lastName);
                setEmail(data.email);
            } else {
               setError("Failed to load user profile, please try again later.");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
          setError("Failed to load user profile, please try again later.");
       }
    };

    const handleUpdateProfile = async () => {
        try{
          const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
              firstName: name,
               lastName: lastName,
               email: email,
            });
          navigate('/search-nannies');
      }
     catch (error){
            console.error("Error updating user profile:", error);
           setError('Failed to update user profile, please try again later.');
      }
    }
    if (error) {
        return <p className="error-message">{error}</p>;
    }
  return (
        <>
        <Navbar />
    <div className="edit-profile-page">
        <h2>Επεξεργασία Προφίλ</h2>
     <div className="user-form">
         <div className="form-group">
            <label htmlFor="name">Όνομα</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
         </div>
            <div className="form-group">
                <label htmlFor="lastName">Επώνυμο</label>
             <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
           </div>
            <div className="form-group">
               <label htmlFor="email">Email</label>
               <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
        <div className="user-buttons">
           <button onClick={handleUpdateProfile} className='update-button'>Αποθήκευση</button>
           <button onClick={() => navigate('/search-nannies')} className='cancel-button'>Άκυρωση</button>
       </div>
    </div>
    </div>
    </>
  );
}

export default EditProfilePage;