import React from 'react';
import './ContactUsPage.css';
import Navbar from '../components/Navbar';

function ContactUsPage() {
   return (
        <>
        <Navbar />
    <div className="contact-us-page">
     <h2>Επικοινωνία</h2>
       <div className="contact-wrapper">
        <form>
          <div className="form-group">
                <label htmlFor="email">Email</label>
               <input type="email" id="email" required/>
            </div>
            <div className="form-group">
                 <label htmlFor="message">Μήνυμα</label>
                <textarea id='message' required></textarea>
            </div>
            <button>Αποστολή</button>
        </form>
    </div>
    </div>
     </>
  );
}

export default ContactUsPage;