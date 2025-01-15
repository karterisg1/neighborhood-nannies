import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './NannyManageAdsPage.css';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function NannyManageAdsPage() {
    const [ads, setAds] = useState([]);
   const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchAds();
    }, []);


  const fetchAds = async () => {
        try{
         const querySnapshot = await getDocs(query(collection(db, 'ads'), where('nannyId', '==', currentUser.uid)));
          const adsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAds(adsData);
        }
       catch(error){
            console.error('Error fetching ads', error);
            setError('Failed to load ads, please try again later');
        }
    };

    const handleDeleteAd = async (adId) => {
      try {
          const adDocRef = doc(db, 'ads', adId);
          await deleteDoc(adDocRef);
          setAds(ads.filter(ad => ad.id !== adId));
      } catch (error) {
          console.error('Error deleting ad:', error);
            setError("Failed to delete ad, please try again later");
      }
    }

    if(error){
     return <p className="error-message">{error}</p>;
   }
  return (
      <>
          <Navbar />
    <div className="nanny-manage-ads-page">
      <h2>Manage Your Ads</h2>
      {ads.length > 0 ? (
           ads.map(ad => (
               <div key={ad.id} className="ad-card">
                   <p><strong>Τίτλος:</strong>{ad.name}</p>
                    <p><strong>Διαθεσιμότητα:</strong>{ad.availability}</p>
                    <p><strong>Απασχόληση:</strong> {ad.employment}</p>
                    <div className="ad-buttons">
                     <button onClick={() => handleDeleteAd(ad.id)} className='delete-button'>Delete</button>
                 </div>
              </div>
            ))
      ) : (
          <p>You have not posted any ads.</p>
        )}
       <div className='create-link'>
           <Link to='/create-ad'>Create Ad</Link>
       </div>
    </div>
      </>
  );
}

export default NannyManageAdsPage;