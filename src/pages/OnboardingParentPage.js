import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.css';

function OnboardingParentPage() {
  const navigate = useNavigate();
  const handleNext = () => {
    navigate('/search-nannies');
  }
  return (
    <div className='onboarding-page'>
      <h2>Καλώς ήρθατε, Γονείς!</h2>
      <div className="onboarding-content">
        <p>Ας ξεκινήσουμε τη διαδικασία εισαγωγής σας.</p>
        <p>1. Δημιουργήστε έναν λογαριασμό</p>
        <p>2. Αναζητήστε νταντάδες που πληρούν τα κριτήριά σας</p>
        <p>3. Επικοινωνήστε με τη νταντά και κλείστε ένα ραντεβού</p>
        <p>4. Υπογράψτε τη σύμβαση εργασίας</p>
        <p>5. Πληρώστε μέσω ψηφιακών κουπονιών.</p>
        <button onClick={handleNext} className='next-button'>Επόμενο</button>
      </div>
    </div>
  );
}

export default OnboardingParentPage;
