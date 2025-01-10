import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './NannyDashboardPage.css';
import Navbar from '../components/Navbar';


function NannyDashboardPage() {
  const [nanny, setNanny] = useState(null);
  const [error, setError] = useState('');
   const {currentUser} = useContext(AuthContext);
  const [ads, setAds] = useState([]);
   useEffect(() => {
      fetchNanny();
      fetchAds();
    }, []);
    const fetchAds = async () => {
        try {
            const querySnapshot = await getDocs(query(collection(db, 'ads'), where('nannyId', '==', currentUser.uid)));
           const adsData = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }));
           setAds(adsData);
        }
        catch(error){
             console.error('Error fetching ads', error);
             setError('Failed to load ads. Please try again later.');
        }
    };


    const fetchNanny = async () => {
       try {
          const querySnapshot = await getDocs(query(collection(db, 'nannies'), where('userId', '==', currentUser.uid)))
           const fetchedNannies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (fetchedNannies.length > 0) {
                setNanny(fetchedNannies[0]);
            }
        }
      catch (error) {
         console.error('Error fetching nanny:', error);
           setError('Failed to load nanny profile. Please try again later.');
        }
    }


    if (!nanny) {
       return <p>Loading nanny dashboard...</p>
    }
     if (error){
         return <p className="error-message">{error}</p>;
     }


    return (
       <>
        <Navbar />
    <div className="nanny-dashboard-page">
      <h2>Καλώς Ήρθες {nanny.name}</h2>
        <div className="dashboard-buttons">
        <Link to='/edit-nanny-profile' className='edit-profile-button'>Επεξεργασία Προφίλ</Link>
         <Link to='/upload-legal-doc' className='upload-legal-button'>Upload Legal Docs</Link>
        <Link to='/create-ad' className='create-ad-button'>Δημιουργία Αγγελίας</Link>
         <Link to='/nanny/manage-ads' className='manage-ads-button'>Manage Ads</Link>
        <Link to='/manage-appointments' className='manage-appointments-button'>Διαχείριση Ραντεβού</Link>
         <Link to='/schedule' className='schedule-button'>Manage Schedule</Link>
        </div>

        <div className="ads-section">
        <h3>Οι Αγγελίες Μου</h3>
            {ads.length > 0 ? (
              ads.map(ad => (
                  <div key={ad.id} className="ad-card">
                      <p><strong>Τίτλος:</strong>{ad.name}</p>
                     <p><strong>Διαθεσιμότητα:</strong>{ad.availability}</p>
                    <p><strong>Απασχόληση:</strong> {ad.employment}</p>
                 </div>
               ))
             ) : (
               <p>Δεν υπάρχουν αγγελίες.</p>
            )}
       </div>
    </div>
       </>
 );
}

export default NannyDashboardPage;