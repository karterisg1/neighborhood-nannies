import React from 'react';
import './FAQPage.css';
import Navbar from '../components/Navbar';


function FAQPage() {
  return (
    <>
        <Navbar />
        <div className="faq-page">
            <h2>Συχνές Ερωτήσεις</h2>
            <div className='faq-wrapper'>
            <div className="faq-section">
                <h3>Πώς μπορώ να βρω μια νταντά;</h3>
                <p>Μπορείτε να βρείτε μια νταντά μέσω της σελίδας αναζήτησης.</p>
            </div>
            <div className="faq-section">
                <h3>Πώς μπορώ να πληρώσω;</h3>
                <p>Η πληρωμή γίνεται μέσω της σελίδας πληρωμής.</p>
            </div>
             <div className="faq-section">
                <h3>Πως υπογράφω συμφωνητικό;</h3>
                <p>Μέσω της σελίδας Αίτηση Συνεργασίας.</p>
            </div>
            </div>
        </div>
    </>
  );
}

export default FAQPage;