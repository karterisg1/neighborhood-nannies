import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './SearchParentsPage.css';
import Navbar from '../components/Navbar';

function SearchParentsPage() {
    const [parents, setParents] = useState([]);
   const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
       fetchParents();
    }, []);

    const fetchParents = async () => {
        try {
          let parentsQuery = collection(db, 'users');
            let constraints = [];
            constraints.push(where('role', '==', 'parent'));

           if (name){
              constraints.push(where('firstName', '==', name));
          }
           if(constraints.length > 0){
             parentsQuery = query(collection(db, 'users'), ...constraints);
           }
          const querySnapshot = await getDocs(parentsQuery);
          const parentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setParents(parentsData);
        } catch(error) {
             console.error("Error fetching parents:", error);
            setError("Failed to load parents. Please try again later.");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchParents();
    }
     const handleNameChange = (e) => {
         setName(e.target.value);
     }
 if (error){
   return <p className="error-message">{error}</p>;
 }
  return (
    <>
        <Navbar />
    <div className="search-parents-page">
        <h2>Αναζήτηση Γονέων</h2>
           <form onSubmit={handleSearch} className="search-form">
                <div className="form-group">
                  <label htmlFor='name'>Όνομα:</label>
                <input type='text' id='name' placeholder='Όνομα' value={name} onChange={handleNameChange}/>
              </div>
               <button type='submit' className='search-button'>Αναζήτηση</button>
           </form>
      <div className="parents-container">
        {parents && parents.length > 0 ? (
            parents.map(parent => (
                <div key={parent.id} className="parent-card">
                   <h3>{parent.firstName + ' ' + parent.lastName}</h3>
                 <p><strong>Email:</strong> {parent.email}</p>
                  <Link to={`/parent/${parent.id}`} className="view-profile-button">Προφίλ</Link>
                </div>
            ))
           ) : (
             <p>No parents found</p>
            )}
      </div>
    </div>
        </>
  );
}

export default SearchParentsPage;