import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './PasswordResetPage.css';
import AuthContext from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

function PasswordResetPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
   const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
      e.preventDefault();
        try {
           await sendPasswordResetEmail(auth, email);
          setMessage('A password reset link has been sent to your email address.');
         } catch (error){
            console.error('Error sending password reset email:', error);
            setError('Failed to send password reset email. Please try again later.');
       }
  };
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    return (
    <>
        <Navbar />
    <div className="password-reset-page">
      <h2>Password Reset</h2>
        {message && <p className='success-message'>{message}</p>}
        <form onSubmit={handleReset}>
            <div className="form-group">
               <label htmlFor="email">Email</label>
               <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className='reset-button'>Reset Password</button>
            <button type="button" onClick={() => navigate('/login')} className='cancel-button'>Cancel</button>
        </form>
    </div>
    </>
  );
}

export default PasswordResetPage;