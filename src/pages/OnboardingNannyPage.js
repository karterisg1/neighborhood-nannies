import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.css';

function OnboardingNannyPage() {
  const navigate = useNavigate();
  const handleNext = () => {
    navigate('/nanny-dashboard');
  }

  return (
    <div className='onboarding-page'>
      <h2>Καλώς ήρθατε, Νταντάδες!</h2>
      <div className="onboarding-content">
        <p>Ας ξεκινήσουμε τη διαδικασία εισαγωγής σας.</p>
        <p>1. Δημιουργήστε ένα προφίλ.</p>
        <p>2. Δημιουργήστε μία Αγγελία Εργασίας και παρέχετε όλες τις απαραίτητες λεπτομέρειες.</p>
        <p>3. Επιβεβαιώστε κρατήσεις από ενδιαφερόμενους χρήστες.</p>
        <p>4. Υπογράψτε σύμβαση με τον επιλεγμένο χρήστη.</p>
        <p>5. Επιβεβαιώστε την ολοκλήρωση των κουπονιών.</p>
        <button onClick={handleNext} className='next-button'>Επόμενο</button>
      </div>
    </div>
  );
}

export default OnboardingNannyPage;
