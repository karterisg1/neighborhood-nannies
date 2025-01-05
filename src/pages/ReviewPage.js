import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './ReviewPage.css';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';

function ReviewPage() {
    const { nannyId } = useParams();
    const [nanny, setNanny] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNanny();
      fetchReviewStatus();
    }, [nannyId]);

     const fetchReviewStatus = async () => {
          try{
             const contractRef = doc(db, 'contracts', `${auth.currentUser.uid}-${nannyId}`);
             const contractSnap = await getDoc(contractRef);
             if (contractSnap.exists()){
                 const data = contractSnap.data();
                 if(data.status === 'completed'){
                     setShowReviewForm(true);
                  }
                }
           }
          catch (error){
              console.error("Error fetching review status:", error);
             setError("Failed to fetch review status, please try again");
        }
     }
    const fetchNanny = async () => {
         try {
            const docRef = doc(db, 'nannies', nannyId);
           const docSnap = await getDoc(docRef);
          if(docSnap.exists()){
              setNanny(docSnap.data());
            } else {
              setError('Nanny not found!');
             }
        } catch (error){
            console.error("Error fetching nanny:", error);
            setError('Failed to load nanny. Please try again later.');
        }
    };

    const handleReviewTextChange = (e) => {
        setReviewText(e.target.value);
    };

    const handleRatingChange = (newRating) => {
      setRating(newRating);
   };


    const handleReviewSubmission = async () => {
       if(rating === 0){
            setError('Please select a star rating.');
           return;
       }
       try{
         const reviewsCollection = collection(db, 'reviews');
         await addDoc(reviewsCollection, {
             nannyId: nannyId,
             userId: auth.currentUser.uid,
             reviewText: reviewText,
             rating: rating,
             date: new Date().toISOString(),
         });
          navigate('/history');
        }
      catch (error){
          console.error("Error submitting the review:", error);
        setError('Failed to submit the review. Please try again later.');
      }
    }
    if(!nanny){
      return <p>Loading review page...</p>
   }
    if (error) {
        return <p className="error-message">{error}</p>;
    }
    return (
     <>
        <Navbar />
       <div className="review-page">
         <h2>Λήξη Συνεργασίας</h2>
        <div className='review-status'>
             <p>Η συνεργασία σας με τη {nanny.name} ολοκληρώνεται.</p>
             <p>Θα θέλατε να ανανεώσετε την συνεργασία σας ή να την ολοκληρώσετε οριστικά;</p>
             <div className="review-radio">
                 <label>
                  <input type='radio' name='cooperation' value='Ανανέωση Συνεργασίας'/>
                  Ανανέωση Συνεργασίας
                 </label>
                  <label>
                  <input type='radio' name='cooperation' value='Οριστική Λήξη'/>
                   Οριστική Λήξη
                 </label>
           </div>
         </div>
         {showReviewForm ? (
          <div className="review-form">
             <h3>Αξιολόγηση Συνεργασίας</h3>
             <p>Θέλετε να αξιολογήσετε την {nanny.name};</p>
              <label>
                 <input type='radio' name='review' value='ΟΧΙ' />
                  Όχι
                </label>
                 <label>
                 <input type='radio' name='review' value='ΝΑΙ' />
                  Ναι
                </label>
            <div className='form-wrapper'>
             <textarea placeholder='Εάν ναι, πείτε μας ένα σχόλιο για το πως ήταν η συνεργασία σας;' value={reviewText} onChange={handleReviewTextChange}/>
              <StarRating onRatingChange={handleRatingChange}/>
               {error && <p className="error-message">{error}</p>}
               <button onClick={handleReviewSubmission} className="submit-review-button">Υποβολή</button>
             </div>
          </div>
        ) : (
           <p>You cannot review yet.</p>
        )}
        </div>
    </>
  );
}

export default ReviewPage;