import React from 'react';
import './EligibilityPage.css';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function EligibilityPage() {
  return (
      <>
          <Navbar />
    <div className="eligibility-page">
      <h2>Κριτήρια Επιλεξιμότητας</h2>

      <div className="criteria-section">
        <h3>Για Γονείς/Κηδεμόνες:</h3>
        <ul>
          <li>Πρέπει να είστε νόμιμος κηδεμόνας ή γονέας παιδιού που χρειάζεται φροντίδα.</li>
          <li>Πρέπει να αποδεχθείτε τους όρους της πλατφόρμας.</li>
          <li>Πρέπει να μπορείτε να πληρώσετε για τις υπηρεσίες (μέσω κουπονιών, όπως εφαρμόζεται στην περίπτωσή μας).</li>
          <li>Πρέπει να έχετε εγγραφεί στον λογαριασμό.</li>
        </ul>
      </div>

      <div className="criteria-section">
        <h3>Για Νταντάδες/Επαγγελματίες:</h3>
        <ul>
          <li>Πρέπει να είστε άνω των 18 ετών.</li>
          <li>Πρέπει να διαθέτετε προσόντα ή εμπειρία στη φροντίδα παιδιών.</li>
          <li>Πρέπει να αποδεχθείτε τους όρους της πλατφόρμας.</li>
          <li>Πρέπει να είστε εγγεγραμμένος χρήστης.</li>
        </ul>
      </div>
          <p>Αν πληροίτε τις προϋποθέσεις επιλεξιμότητας, μπορείτε να συνεχίσετε στην <Link to='/register'>εγγραφή</Link>.</p>
    </div>
      </>
  );
}

export default EligibilityPage;
