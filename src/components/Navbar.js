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
           <Link to="/">Νταντάδες της Γειτονιάς</Link>
         </div>
         <div className="navbar-links">
          {currentUser && (
              <>
                {currentUser?.displayName && <span className='user-name'>Καλώς ήρθες, {currentUser.displayName}</span>}
                {userRole === 'parent' && (
               <>
                <Link to="/search-nannies">Αναζήτηση</Link>
                   <Link to='/parent-dashboard'>Dashboard</Link>
                 <Link to='/edit-profile'>Επεξεργασία Προφίλ</Link>
                <Link to="/history">Ιστορικό</Link>
               <Link to="/vouchers">Vouchers</Link>
                  <Link to='/notifications'>Notifications</Link>
                   </>
              )}
             {userRole === 'nanny' && (
                 <>
                    <Link to="/search-nannies">Αναζήτηση</Link>
               <Link to='/nanny-dashboard'>Dashboard</Link>
                  <Link to='/edit-profile'>Επεξεργασία Προφίλ</Link>
                    <Link to="/history">Ιστορικό</Link>
                       <Link to="/vouchers">Vouchers</Link>
                      <Link to='/notifications'>Notifications</Link>
                   </>
               )}
               { currentUser?.email && currentUser?.email === 'admin@gmail.com' && <Link to='/admin-dashboard'>Admin</Link>}
                <Link to='/help'>Help</Link>
                <button onClick={handleLogout}>Αποσύνδεση</button>
              </>
             )}
             {!currentUser && (
              <>
                  <Link to="/eligibility">Eligibility</Link>
                   <Link to="/how-it-works">How it works</Link>
                    <Link to="/faq">FAQ</Link>
                   <Link to="/about-us">About Us</Link>
              </>
           )}
         </div>
   </nav>
 );
}

export default Navbar;