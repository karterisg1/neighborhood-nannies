import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import './RegistrationPage.css';

function RegistrationPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }
      const { user, error } = await register(email, password, firstName, lastName);
    if (user) {
      navigate('/search-nannies');
    } else if (error) {
      setError(error);
    }
  };

   const handleTaxisnetRegister = () => {
         window.location.href = 'https://www1.gsis.gr/taxisnet/mytaxisnet';  // Replace with the actual TaxisNet register URL
  };

  return (
    <div className="registration-page">
      <div className="registration-form">
        <h2>Σελίδα Εγγραφής</h2>
          {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="firstName">Όνομα</label>
            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
            <div className="form-group">
                <label htmlFor="lastName">Επώνυμο</label>
                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Κωδικός</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Επιβεβαίωση Κωδικού</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
            <button type="submit" className="register-button">Ολοκλήρωση Εγγραφής</button>
            <button type="button" onClick={handleTaxisnetRegister} className="taxisnet-register-button">Εγγραφή με TaxisNet</button>
            <div className="register-footer">
              <Link to="/login">Έχετε Λογαριασμό; Είσοδος</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;