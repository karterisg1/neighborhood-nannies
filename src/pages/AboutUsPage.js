import React from 'react';
import './AboutUsPage.css';
import Navbar from '../components/Navbar';


function AboutUsPage() {
  return (
        <>
        <Navbar />
    <div className="about-us-page">
      <h2>Σχετικά με Εμάς</h2>
        <div className="about-wrapper">
        <p>Είμαστε μια πλατφόρμα που βοηθάει τους γονείς να βρουν νταντάδες.</p>
           <p>Αυτη η πλατφορμα φτιάχτηκε στα πλαίσια της εργασίας Επικοινωνία Ανθρώπου Μηχανής.</p>
       </div>
    </div>
    </>
  );
}

export default AboutUsPage;