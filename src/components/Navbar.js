import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

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
              <Link to="/search-nannies">Αναζήτηση</Link>
                { currentUser?.email && currentUser?.email === 'admin@gmail.com' && <Link to='/admin-dashboard'>Admin</Link>}
              { currentUser?.email && currentUser?.email.includes('@gmail.com') === false ? <Link to='/nanny-dashboard'>Dashboard</Link> : null}
                 { currentUser?.email && currentUser?.email.includes('@gmail.com') ? <Link to='/parent-dashboard'>Dashboard</Link> : null}
             <Link to='/edit-profile'>Επεξεργασία Προφίλ</Link>
               <Link to="/history">Ιστορικό</Link>
                <Link to='/vouchers'>Vouchers</Link>
                 <Link to='/notifications'>Notifications</Link>
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