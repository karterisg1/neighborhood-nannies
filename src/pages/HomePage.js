import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from '../assets/logo.png';

function HomePage() {
    return (
        <div className="home-page">
            <div className="top-links">
                <Link to="/how-it-works" className="top-link" aria-label="Πώς λειτουργεί">How it works</Link>
                <Link to="/faq" className="top-link" aria-label="Συχνές Ερωτήσεις">FAQ</Link>
                <Link to="/about-us" className="top-link" aria-label="Σχετικά με Εμάς">About Us</Link>
            </div>
            <main className="home-main">
                <div className="hero">
                    <img src={logo} alt="Logo" className='home-logo'/>
                    <h1 className='header-text'>Καλώς ήρθατε στις Νταντάδες της Γειτονιάς!</h1>
                    <p className='main-text'>Εξερευνήστε πώς μπορούμε να σας βοηθήσουμε να βρείτε πιστοποιημένους επαγγελματίες για το παιδί σας.</p>
                </div>
                <div className="sections-wrapper">
                    <div className="home-section">
                        <h2 className='section-header'>Γονείς/Κηδεμόνες</h2>
                        <ul>
                            <li>Εύκολη αναζήτηση νταντάδων κοντά σας</li>
                            <li>Εγγύηση ασφάλειας και πιστοποίησης</li>
                            <li>Απλές διαδικασίες κράτησης και πληρωμής</li>
                        </ul>
                    </div>
                    <div className="home-section">
                        <h2 className='section-header'>Επιμελητές/Επαγγελματίες</h2>
                        <ul>
                            <li>Προφίλ για αναζήτηση εργασίας.</li>
                            <li>Εύκολη διαχείριση συνεργασιών.</li>
                            <li>Γρήγορες πληρωμές μέσω της πλατφόρμας</li>
                        </ul>
                    </div>
                </div>
                 <div className='home-buttons'>
                    <Link to="/register" className="register-button">Εγγραφή</Link>
                    <Link to="/login" className="login-button">Είσοδος</Link>
                     <Link to="/eligibility" className="eligibility-button">Eligibility Criteria</Link>
                 </div>
            </main>
        </div>
    );
}

export default HomePage;