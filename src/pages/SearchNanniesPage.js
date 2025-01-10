import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './SearchNanniesPage.css';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function SearchNanniesPage() {
    const [nannies, setNannies] = useState([]);
    const [filters, setFilters] = useState({
        location: '',
        experience: '',
        specialties: '',
        employment: ''
    });
    const [error, setError] = useState('');


    useEffect(() => {
        fetchNannies();
    }, [filters]);

    const fetchNannies = async () => {
        try {
            let q = query(collection(db, 'nannies'));

            if (filters.location) {
                q = query(q, where('location', '==', filters.location));
            }
             if (filters.experience) {
              q = query(q, where('experience', '==', filters.experience));
          }
            if (filters.specialties) {
                q = query(q, where('specialties', '==', filters.specialties));
            }
            if (filters.employment) {
                q = query(q, where('employment', '==', filters.employment));
            }
            const querySnapshot = await getDocs(q);
            const nanniesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNannies(nanniesData);
        }
        catch (error) {
            console.error('Error fetching nannies:', error);
            setError('Failed to load nannies. Please try again later.');
        }
    };
      const handleFilterChange = (e) => {
       const {name, value} = e.target;
        setFilters(prevFilters => ({
         ...prevFilters,
         [name]: value
        }));
      };
    if (error){
      return <p className="error-message">{error}</p>;
    }
    return (
        <>
        <Navbar />
    <div className="search-nannies-page">
          <h2>Αναζήτηση Νταντάς</h2>
        <div className="search-filters">
            <input type="text"
             name='location'
              placeholder="Περιοχή"
               value={filters.location}
               onChange={handleFilterChange}
               />
            <input type="text"
              name="experience"
              placeholder="Εμπειρία"
               value={filters.experience}
                onChange={handleFilterChange}
              />
            <input
              type="text"
              name="specialties"
              placeholder="Ειδικότητες"
              value={filters.specialties}
              onChange={handleFilterChange}
              />
          <select name="employment" value={filters.employment} onChange={handleFilterChange}>
              <option value=''>Όλα τα είδη απασχόλησης</option>
             <option value="ΠΛΗΡΗΣ/ΜΕΡΙΚΗ">ΠΛΗΡΗΣ/ΜΕΡΙΚΗ</option>
               <option value="ΠΛΗΡΗΣ">ΠΛΗΡΗΣ</option>
             <option value="ΜΕΡΙΚΗ">ΜΕΡΙΚΗ</option>
           </select>
           <Link to="/search/advanced" className="advanced-search-button">Advanced Search</Link>
        </div>
       <div className="search-results">
            {nannies.length === 0 ? (
                <p>Δεν βρέθηκαν νταντάδες με αυτά τα κριτήρια.</p>
             ) : (
                nannies.map(nanny => (
                  <div key={nanny.id} className="nanny-card">
                       <h3>{nanny.name}</h3>
                       <p><strong>Εμπειρία:</strong> {nanny.experience}</p>
                        <p><strong>Ειδικότητες:</strong> {nanny.specialties}</p>
                        <Link to={`/nanny/${nanny.id}`} className='view-profile-button'>Προφίλ</Link>
                    </div>
               ))
           )}
      </div>
  </div>
    </>
 );
}

export default SearchNanniesPage;