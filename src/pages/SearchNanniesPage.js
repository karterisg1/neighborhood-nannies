import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './SearchNanniesPage.css';
import Navbar from '../components/Navbar';


function SearchNanniesPage() {
    const [age, setAge] = useState('');
    const [specialties, setSpecialties] = useState('');
    const [availability, setAvailability] = useState('');
    const [nannies, setNannies] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchNannies();
    }, []);

    const fetchNannies = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'nannies'));
            const nanniesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNannies(nanniesData);
        } catch (error) {
            console.error('Error fetching nannies', error);
            setError('Failed to load nannies. Please try again later.');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        let searchQuery = collection(db, 'nannies');
        let constraints = [];

        if(age){
            constraints.push(where('age', '==', age));
        }
        if(specialties){
            constraints.push(where('specialties', '==', specialties));
        }
        if(availability){
            constraints.push(where('availability', '==', availability));
        }

        if(constraints.length > 0){
           searchQuery = query(collection(db, 'nannies'), ...constraints);
        }

        try {
          const querySnapshot = await getDocs(searchQuery);
          const searchNanniesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setNannies(searchNanniesData);
        } catch (error) {
          console.error("Error searching nannies:", error);
          setError('Failed to search nannies. Please try again later.');
        }
      };

    return (
      <>
            <Navbar />
        <div className="search-nannies-page">
        <div className="search-container">
          <h2 className="search-header">Αναζήτηση Νταντάδων</h2>
             {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSearch}>
            <div className="form-group">
                <label htmlFor="age">Ηλικία Παιδιού</label>
                <input type="text" id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder='Ηλικία'/>
            </div>
            <div className="form-group">
              <label htmlFor="specialties">Ειδικότητες</label>
              <input type="text" id="specialties" value={specialties} onChange={(e) => setSpecialties(e.target.value)} placeholder='Ειδικότητες' />
            </div>
             <div className="form-group">
                 <label htmlFor="availability">Διαθεσιμότητα</label>
                <input type="text" id="availability" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder='Διαθεσιμότητα' />
              </div>
            <button type="submit" className="search-button">Αναζήτηση</button>
          </form>
        </div>

        <div className="nannies-container">
           {nannies && nannies.length > 0 ? (
            nannies.map(nanny => (
              <div key={nanny.id} className="nanny-card">
                <h3>{nanny.name}</h3>
                <p>Εμπειρία: {nanny.experience}</p>
                <p>Ειδικότητες: {nanny.specialties}</p>
                <Link to={`/nanny/${nanny.id}`} className="view-profile-button">Προφίλ</Link>
             </div>
           ))
           ) : (
           <p>Δεν βρέθηκαν αποτελέσματα.</p>
           )}
        </div>
      </div>
    </>
  );
}

export default SearchNanniesPage;