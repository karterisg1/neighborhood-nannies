import React, { useState } from 'react';
import './StarRating.css';
import { FaStar } from 'react-icons/fa';
function StarRating({ onRatingChange }) {
    const [rating, setRating] = useState(0);
   const handleStarClick = (star) => {
      setRating(star);
        onRatingChange(star);
   };

    const renderStars = () => {
     const stars = [];
        for(let i=1; i<=5; i++){
           stars.push(
             <FaStar
                key={i}
               className={`star ${i <= rating ? 'active' : ''}`}
                onClick={() => handleStarClick(i)}
               />
            );
        }
      return stars;
    };
    return(
     <div className='star-rating'>
       {renderStars()}
   </div>
 );
}
export default StarRating;