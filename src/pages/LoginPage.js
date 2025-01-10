import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import './LoginPage.css';


function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
         const { user, error } = await login(email, password);
        if(user){
            if(user.role === 'parent'){
                navigate('/search-nannies');
            }
            else {
                navigate('/nanny-dashboard');
            }

        }
        else if(error){
           setError(error);
        }
    };
      const handleTaxisnetLogin = () => {
          //Redirect to Taxisnet authentication here
          window.location.href = 'YOUR_TAXISNET_LOGIN_URL'; // Replace with your actual TaxisNet URL
      };


    return (
    <div className="login-page">
            <div className="login-form">
                <h2>Είσοδος</h2>
              {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Κωδικός</label>
                         <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                   </div>
                    <button type="submit" className="login-button">Είσοδος</button>
                    <button type="button" onClick={handleTaxisnetLogin} className="taxisnet-login-button">Είσοδος με TaxisNet</button>
                     <div className="login-footer">
                         <Link to="/register">Εγγραφή</Link>
                          <Link to="/reset-password">Ξέχασα τον κωδικό</Link>
                    </div>
                </form>
            </div>
    </div>
 );
}

export default LoginPage;