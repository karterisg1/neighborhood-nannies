import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './ReviewDetailsPage.css';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import { formatDate } from '../utils/utils';
function ReviewDetailsPage() {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    const [error, setError] = useState('');
  const navigate = useNavigate();
    useEffect(() => {
      fetchReview();
    }, [id]);


  const fetchReview = async () => {
    try {
        const docRef = doc(db, 'reviews', id);
       const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            setReview(docSnap.data());
        } else {
           setError("Review not found");
      }
    } catch (error){
         console.error("Error fetching review", error);
       setError("Failed to load review. Please try again later.")
    }
  };
   if (!review) {
      return <p>Loading review details...</p>
    }
    if (error) {
      return <p className="error-message">{error}</p>;
    }

  return (
      <>
          <Navbar />
    <div className="review-details-page">
      <h2>Review Details</h2>
     <div className="review-info">
       <p><strong>Nanny ID:</strong> {review.nannyId}</p>
       <p><strong>User ID:</strong> {review.userId}</p>
        <p><strong>Review Date:</strong> {formatDate(review.date)}</p>
        <p><strong>Rating:</strong> <StarRating rating={review.rating}/></p>
       <p><strong>Review Text:</strong></p>
           <textarea value={review.reviewText} readOnly/>
    </div>
        <button onClick={() => navigate('/history')}>Go Back</button>
   </div>
    </>
  );
}

export default ReviewDetailsPage;