import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './ParentProfilePage.css';
import Navbar from '../components/Navbar';

function ParentProfilePage() {
  const { id } = useParams();
  const [parent, setParent] = useState(null);
 const [error, setError] = useState('');

    useEffect(() => {
     fetchParent();
    }, [id]);

   const fetchParent = async () => {
    try {
        const docRef = doc(db, 'users', id);
       const docSnap = await getDoc(docRef);
          if(docSnap.exists()){
            setParent(docSnap.data());
          } else {
            setError('Parent not found!');
         }
     }
    catch (error) {
        console.error('Error fetching parent:', error);
       setError('Failed to load parent. Please try again later.');
    }
   };
     if (!parent){
        return <p>Loading parent page...</p>
     }
     if (error) {
        return <p className="error-message">{error}</p>;
    }


  return (
       <>
        <Navbar />
      <div className="parent-profile-page">
        <h2>{parent.firstName} {parent.lastName}</h2>
        <div className="profile-info">
          <p><strong>Email:</strong> {parent.email}</p>
          <p><strong>Role:</strong> {parent.role}</p>
        </div>
        <div className="profile-buttons">
          <Link to={`/booking/${id}`} className="book-button">Προγραμματισμός Ραντεβού</Link>
          <Link to={`/chat/${id}`} className="chat-button">Chat</Link>
        </div>
      </div>
       </>
  );
}

export default ParentProfilePage;