import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import './RegistrationPage.css';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';


function RegistrationPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('parent');
    const [error, setError] = useState(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleRegister = async (e) => {
     e.preventDefault();
    if (password !== confirmPassword) {
      setError("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }
        const { user, role: userRole, error: registerError } = await register(email, password, firstName, lastName, role);
        if(user){
           if (userRole === 'nanny') {
               try {
                  const nanniesCollection = collection(db, 'nannies');
                   await addDoc(nanniesCollection, {
                       userId: user.uid,
                       name: `${firstName} ${lastName}`,
                       email: email,
                   });
                   const userRef = doc(db, 'users', user.uid);
                   await setDoc(userRef, { firstName: firstName, lastName: lastName, email: email, role: userRole});
               } catch (err) {
                 console.error("Error creating nanny profile:", err);
                 setError('Failed to create nanny profile, please try again later.');
                return;
             }
             navigate('/onboarding-nanny');
          }
           else {
               const userRef = doc(db, 'users', user.uid);
               await setDoc(userRef, { firstName: firstName, lastName: lastName, email: email, role: userRole});
              navigate('/onboarding-parent');
            }
         } else if (registerError) {
            setError(registerError);
         }
  };

  const handleTaxisnetRegister = () => {
     //Redirect to Taxisnet registration
     window.location.href = 'https://login.gsis.gr/mylogin/login.jsp?bmctx=1DB55AB50C08F2B418903DE4EB7466AD47038BC455E39B9EA82B1EB28CE52BC6&contextType=external&username=string&password=secure_string&challenge_url=https%3A%2F%2Flogin.gsis.gr%2Fmylogin%2Flogin.jsp&ssoCookie=disablehttponly&request_id=-5842705815979373440&authn_try_count=0&locale=en_US&resource_url=https%253A%252F%252Fwww1.gsis.gr%252Ftaxisnet%252Fmytaxisnet%252Fprotected%252Fauthorizations.htm'; // Replace with your actual TaxisNet URL
   };
   const handleRoleChange = (e) => {
      setRole(e.target.value);
    };
  return (
    <div className="registration-page">
      <div className="registration-form">
        <h2>Σελίδα Εγγραφής</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="firstName">Όνομα</label>
            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required aria-label="Εισάγετε το όνομά σας"/>
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Επώνυμο</label>
            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required aria-label="Εισάγετε το επώνυμό σας" />
          </div>
          <div className="form-group">
           <label htmlFor="email">Email</label>
           <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="Εισάγετε το email σας"/>
         </div>
          <div className="form-group">
            <label htmlFor="password">Κωδικός</label>
             <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-label="Εισάγετε τον κωδικό σας"/>
          </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Επιβεβαίωση Κωδικού</label>
             <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required aria-label="Επιβεβαίωση κωδικού" />
          </div>
           <div className="form-group">
            <label htmlFor='role'>Είμαι</label>
               <select id='role' value={role} onChange={handleRoleChange} aria-label="Επιλέξτε ρόλο">
                   <option value='parent'>Γονέας</option>
                 <option value='nanny'>Νταντά/Επιμελητής</option>
              </select>
            </div>
          <button type="submit" className="register-button" aria-label="Ολοκλήρωση Εγγραφής">Ολοκλήρωση Εγγραφής</button>
        <button type="button" onClick={handleTaxisnetRegister} className="taxisnet-register-button" aria-label="Εγγραφή με TaxisNet">Εγγραφή με TaxisNet</button>
            <div className="register-footer">
              <Link to="/login"  aria-label="Μεταβείτε στην σελίδα σύνδεσης">Έχετε Λογαριασμό; Είσοδος</Link>
           </div>
        </form>
      </div>
   </div>
 );
}

export default RegistrationPage;