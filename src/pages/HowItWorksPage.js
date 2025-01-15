import React from 'react';
import './HowItWorksPage.css';
import Navbar from '../components/Navbar';

function HowItWorksPage() {
    return (
      <>
          <Navbar />
    <div className="how-it-works-page">
      <h2>Πώς Λειτουργεί</h2>

      <div className="steps-section">
        <h3>Για Γονείς/Κηδεμόνες:</h3>
        <ol>
          <li><strong>Εγγραφή:</strong> Δημιουργήστε έναν λογαριασμό στην πλατφόρμα.</li>
          <li><strong>Αναζήτηση:</strong> Αναζητήστε νταντάδες που πληρούν τα κριτήριά σας.</li>
          <li><strong>Επικοινωνία:</strong> Επικοινωνήστε με τις επιλεγμένες νταντάδες.</li>
          <li><strong>Κράτηση:</strong> Προγραμματίστε μία συνάντηση.</li>
          <li><strong>Σύμβαση:</strong> Επίσημοποιήστε τη συμφωνία με την επιλεγμένη νταντά.</li>
          <li><strong>Πληρωμή:</strong> Πληρώστε μέσω ψηφιακών κουπονιών.</li>
          <li><strong>Αξιολόγηση:</strong> Υποβάλετε την κριτική σας μετά την υπηρεσία.</li>
        </ol>
      </div>

      <div className="steps-section">
        <h3>Για Νταντάδες/Επαγγελματίες:</h3>
        <ol>
          <li><strong>Εγγραφή:</strong> Δημιουργήστε το προφίλ σας στην πλατφόρμα.</li>
          <li><strong>Δημιουργία Αγγελίας:</strong> Κοινοποιήστε την αγγελία σας με λεπτομερείς πληροφορίες.</li>
          <li><strong>Αποδοχή Κράτησης:</strong> Επικοινωνήστε με τους χρήστες και επιβεβαιώστε την κράτηση.</li>
          <li><strong>Σύμβαση:</strong> Υπογράψτε μία σύμβαση.</li>
          <li><strong>Επιβεβαίωση Κουπονιού:</strong> Παραλάβετε το ψηφιακό κουπόνι από τον γονέα.</li>
          <li><strong>Πληρωμή:</strong> Επιβεβαιώστε την ολοκλήρωση του κουπονιού.</li>
          <li><strong>Αξιολογήσεις:</strong> Λάβετε χρήσιμα σχόλια για τις υπηρεσίες σας.</li>
        </ol>
      </div>
      <p>Αν έχετε απορίες, ανατρέξτε στην ενότητα Συχνών Ερωτήσεων (FAQ).</p>
    </div>
      </>
  );
}

export default HowItWorksPage;