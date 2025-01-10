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
          window.location.href = 'https://login.gsis.gr/mylogin/login.jsp?bmctx=1DB55AB50C08F2B418903DE4EB7466AD47038BC455E39B9EA82B1EB28CE52BC6&contextType=external&username=string&password=secure_string&challenge_url=https%3A%2F%2Flogin.gsis.gr%2Fmylogin%2Flogin.jsp&ssoCookie=disablehttponly&request_id=-5842705815979373440&authn_try_count=0&locale=en_US&resource_url=https%253A%252F%252Fwww1.gsis.gr%252Ftaxisnet%252Fmytaxisnet%252Fprotected%252Fauthorizations.htm'; // Replace with your actual TaxisNet URL
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