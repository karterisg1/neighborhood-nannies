import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './FullNannyProfilePage.css';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';

function FullNannyProfilePage() {
    const { id } = useParams();
    const [nanny, setNanny] = useState(null);
     const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState(0);
    useEffect(() => {
        fetchNanny();
     fetchReviews();
    }, [id]);

    const fetchNanny = async () => {
      try {
         const docRef = doc(db, 'nannies', id);
         const docSnap = await getDoc(docRef);
          if(docSnap.exists()){
            setNanny(docSnap.data());
         } else {
            setError('Nanny not found!');
         }
      } catch (error) {
          console.error('Error fetching nanny:', error);
         setError('Failed to load nanny. Please try again later.');
      }
    };
    const fetchReviews = async () => {
      try {
        const reviewsQuery = query(collection(db, 'reviews'), where('nannyId', '==', id));
          const querySnap = await getDocs(reviewsQuery);
           const fetchedReviews = querySnap.docs.map(doc => ({id: doc.id, ...doc.data()}));
         setReviews(fetchedReviews);
      }
      catch(error){
          console.error("Error fetching reviews:", error);
        setError('Failed to load reviews. Please try again later.');
      }
    };

     useEffect(() => {
       calculateAverageRating();
    }, [reviews]);

     const calculateAverageRating = () => {
       if (reviews.length === 0) {
         setAverageRating(0);
         return;
        }
       const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(totalRatings / reviews.length);
     };


  if (!nanny) {
    return <p>Loading full nanny profile...</p>
  }
    if (error) {
        return <p className="error-message">{error}</p>;
    }

  return (
      <>
          <Navbar />
    <div className="full-nanny-profile-page">
        <h2>{nanny.name}</h2>
      <div className="profile-section">
          <h3>Personal Information</h3>
          <p><strong>Email:</strong> {nanny.email}</p>
          <p><strong>Phone:</strong> {nanny.phone}</p>
         <p><strong>Gender:</strong> {nanny.gender}</p>
      </div>
        <div className="profile-section">
           <h3>Professional Details</h3>
            <p><strong>Experience:</strong> {nanny.experience}</p>
            <p><strong>Studies:</strong> {nanny.studies}</p>
            <p><strong>Specialties:</strong> {nanny.specialties}</p>
        </div>
          <div className="review-section">
             <h3>Reviews</h3>
             <p>Average Rating: <StarRating rating={averageRating}/></p>
              {reviews.length > 0 ? (
                 reviews.map(review => (
                   <div key={review.id} className='review-card'>
                       <p><strong>Rating:</strong> <StarRating rating={review.rating} /></p>
                       <p><strong>Comment:</strong> {review.reviewText}</p>
                   </div>
                ))
            ) : (
                 <p>No reviews at the moment.</p>
            )}
         </div>
    </div>
      </>
  );
}

export default FullNannyProfilePage;