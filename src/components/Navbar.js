import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import './Navbar.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Navbar() {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
      const fetchUserRole = async () => {
       if(currentUser){
         try {
           const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
              if(userSnap.exists()){
                setUserRole(userSnap.data().role)
             }
            }
       catch (error){
           console.error('Error fetching user:', error);
         }
        }
       else {
         setUserRole(null)
       }
    };
         fetchUserRole();
      }, [currentUser]);

    const handleLogout = async () => {
        await logout();
       navigate('/');
    };
  return (
    <nav className="navbar">
        <div className="navbar-brand">
           <Link to="/" aria-label="Go to Home">Νταντάδες της Γειτονιάς</Link>
         </div>
         <div className="navbar-links">
         {currentUser ? (
              <>
                {currentUser?.displayName && <span className='user-name'>Καλώς ήρθες, {currentUser.displayName}</span>}
                {userRole === 'parent' && (
               <>
                <Link to="/search-nannies" aria-label="Αναζήτηση νταντάδων">Αναζήτηση</Link>
                   <Link to='/parent-dashboard' aria-label="Πίνακας Ελέγχου Γονέα">Dashboard</Link>
                 <Link to='/edit-profile' aria-label="Επεξεργασία Προφίλ">Επεξεργασία Προφίλ</Link>
                <Link to="/history" aria-label="Ιστορικό">Ιστορικό</Link>
               <Link to="/vouchers" aria-label="Vouchers">Vouchers</Link>
                  <Link to='/notifications' aria-label="Ειδοποιήσεις">Notifications</Link>
                   </>
              )}
             {userRole === 'nanny' && (
                 <>
                    <Link to="/search-parents" aria-label="Αναζήτηση γονέων">Αναζήτηση</Link>
               <Link to='/nanny-dashboard' aria-label="Πίνακας Ελέγχου Νταντάς">Dashboard</Link>
                  <Link to='/edit-profile' aria-label="Επεξεργασία Προφίλ">Επεξεργασία Προφίλ</Link>
                    <Link to="/history" aria-label="Ιστορικό">Ιστορικό</Link>
                       <Link to="/vouchers" aria-label="Vouchers">Vouchers</Link>
                      <Link to='/notifications' aria-label="Ειδοποιήσεις">Notifications</Link>
                    <Link to="/nanny-history" aria-label="Ιστορικό Συμβάσεων">My Contracts</Link>
                      <Link to='/settings' aria-label="Ρυθμίσεις">Settings</Link>
                   </>
               )}
               { currentUser?.email && currentUser?.email === 'admin@gmail.com' && <Link to='/admin-dashboard' aria-label="Πίνακας Ελέγχου Διαχειριστή">Admin</Link>}
                <Link to='/help' aria-label="Βοήθεια">Help</Link>
                  <Link to='/messages/inbox' aria-label='Εισερχόμενα'>Inbox</Link>
                  <Link to='/messages/outbox' aria-label='Απεσταλμένα'>Outbox</Link>
                <button onClick={handleLogout} aria-label="Αποσύνδεση">Αποσύνδεση</button>
              </>
             ) : (
              <>
                <Link to="/eligibility" aria-label="Κριτήρια Επιλεξιμότητας">Eligibility</Link>
                 <Link to="/how-it-works" aria-label="Πώς Λειτουργεί">How it works</Link>
                 <Link to="/faq" aria-label="Συχνές Ερωτήσεις">FAQ</Link>
                  <Link to="/about-us" aria-label="Σχετικά με Εμάς">About Us</Link>
              </>
            )}
         </div>
   </nav>
 );
}

export default Navbar;