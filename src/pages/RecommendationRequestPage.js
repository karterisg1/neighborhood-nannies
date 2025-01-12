import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './RecommendationRequestPage.css';
import Navbar from '../components/Navbar';

function RecommendationRequestPage() {
    const [email, setEmail] = useState('');
   const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);
   const { nannyId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
       e.preventDefault();
       if (!email) {
         setError("Please provide an email address");
         return;
        }
    try {
       const recommendationCollection = collection(db, 'recommendations');
        await addDoc(recommendationCollection, {
         email: email,
            nannyId: nannyId,
            userId: currentUser.uid,
           createdAt: new Date().toISOString(),
        });
          setEmail('');
         navigate(`/nanny/${nannyId}/full-profile`);
       }
     catch (error) {
        setError("Failed to send recommendation request. Please try again later.");
           console.error("Error requesting recommendation:", error);
        }
    };
    if(error){
       return <p className="error-message">{error}</p>;
    }
  return (
    <>
         <Navbar />
    <div className="recommendation-request-page">
      <h2>Request a Recommendation</h2>
       <div className="request-form">
          <form onSubmit={handleSubmit}>
             <div className="form-group">
               <label htmlFor="email">Email Address:</label>
               <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
               <button type='submit' className='submit-button'>Send Request</button>
           </form>
       </div>
    </div>
    </>
  );
}

export default RecommendationRequestPage;