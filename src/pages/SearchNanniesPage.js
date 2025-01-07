import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, startAfter, limit } from 'firebase/firestore';
import './SearchNanniesPage.css';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';

function SearchNanniesPage() {
    const [age, setAge] = useState('');
    const [specialties, setSpecialties] = useState('');
    const [availability, setAvailability] = useState('');
    const [location, setLocation] = useState('');
    const [experience, setExperience] = useState('');
     const [studies, setStudies] = useState('');
    const [gender, setGender] = useState('');
    const [nannies, setNannies] = useState([]);
    const [error, setError] = useState('');
    const [sortByRating, setSortByRating] = useState(false);
     const [lastDoc, setLastDoc] = useState(null);


   useEffect(() => {
      fetchNannies();
   }, []);

   const fetchNannies = async (isNewQuery = true) => {
    try {
        let nanniesQuery = collection(db, 'nannies');
       let constraints = [];
       if (age) {
            constraints.push(where('age', '==', age));
        }
       if (specialties) {
          constraints.push(where('specialties', '==', specialties));
        }
         if (availability) {
           constraints.push(where('availability', '==', availability));
        }
        if(location){
         constraints.push(where('location', '==', location));
       }
       if(experience){
           constraints.push(where('experience', '==', experience));
       }
       if (studies) {
            constraints.push(where('studies', '==', studies));
       }
       if (gender) {
         constraints.push(where('gender', '==', gender));
        }

         if(constraints.length > 0){
           nanniesQuery = query(collection(db, 'nannies'), ...constraints);
        }
          let queryWithSorting = nanniesQuery;
          if(sortByRating){
            queryWithSorting = query(nanniesQuery, orderBy('rating', 'desc'));
          }
          let queryWithPagination = queryWithSorting;
          if(!isNewQuery && lastDoc) {
            queryWithPagination = query(queryWithSorting, startAfter(lastDoc), limit(5));
        } else {
           queryWithPagination = query(queryWithSorting, limit(5));
         }
        const querySnapshot = await getDocs(queryWithPagination);
       const newNannies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setNannies(prevNannies => isNewQuery ? newNannies : [...prevNannies, ...newNannies]);
         setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

    } catch (error) {
        console.error('Error fetching nannies', error);
          setError('Failed to load nannies. Please try again later.');
       }
    };

    const handleSearch = async (e) => {
      e.preventDefault();
       setNannies([]);
       setLastDoc(null);
      await fetchNannies(true);
    };
    const handleSortRating = async () => {
      setSortByRating(prev => !prev);
      setNannies([]);
     setLastDoc(null);
      await fetchNannies(true);
    };
     const handleLoadMore = async () => {
      await fetchNannies(false);
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
                  <label htmlFor="location">Περιοχή</label>
                   <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Περιοχή' />
              </div>
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
              <div className="form-group">
                   <label htmlFor="experience">Εμπειρία</label>
                   <input type="text" id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder='Εμπειρία' />
               </div>
             <div className="form-group">
                 <label htmlFor="studies">Σπουδές</label>
                <input type="text" id="studies" value={studies} onChange={(e) => setStudies(e.target.value)} placeholder='Σπουδές'/>
              </div>
              <div className="form-group">
                  <label htmlFor="gender">Φύλο</label>
                  <input type="text" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder='Φύλο' />
                </div>
            <button type="submit" className="search-button">Αναζήτηση</button>
              <button type='button' onClick={handleSortRating} className={`sort-button ${sortByRating ? 'active' : ''}`}>Ταξινόμηση κατά βαθμολογία</button>
          </form>
        </div>

        <div className="nannies-container">
           {nannies && nannies.length > 0 ? (
            nannies.map(nanny => (
              <div key={nanny.id} className="nanny-card">
                <h3>{nanny.name}</h3>
               <StarRating rating={nanny.rating} />
                <p>Εμπειρία: {nanny.experience}</p>
                <p>Ειδικότητες: {nanny.specialties}</p>
                <Link to={`/nanny/${nanny.id}`} className="view-profile-button">Προφίλ</Link>
              </div>
            ))
            ) : (
           <p>Δεν βρέθηκαν αποτελέσματα.</p>
            )}
          {nannies.length > 0 && (
             <button onClick={handleLoadMore} className="load-more-button">Φόρτωση Περισσοτέρων</button>
          )}
        </div>
      </div>
      </>
  );
}

export default SearchNanniesPage;