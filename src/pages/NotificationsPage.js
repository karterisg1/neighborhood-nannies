import React, { useState, useEffect, useContext } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './NotificationsPage.css';
import Navbar from '../components/Navbar';
import { formatDistanceToNow } from 'date-fns';
import { el } from 'date-fns/locale';

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);
    useEffect(() => {
       let unsubscribe;
        const fetchNotifications = async () => {
           if(!currentUser){
                setLoading(false);
                setError("User not logged in.");
               return;
            }
           setLoading(true);
            try {
                const notificationsQuery = query(
                 collection(db, 'notifications'),
                where('userId', '==', currentUser.uid)
               );
               unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
                 const notificationsData = snapshot.docs.map(doc => {
                 const createdAtValue = doc.data().createdAt;
                   const createdAt = typeof createdAtValue === 'string'
                    ? new Date(createdAtValue)
                     : (createdAtValue ? createdAtValue.toDate() : new Date());

                    return { id: doc.id, ...doc.data(), createdAt: createdAt}
                });
                    setNotifications(notificationsData);
                    setLoading(false);
           }, (error) => {
               console.error("Error in snapshot listener:", error);
                setError("Failed to fetch notifications, " + error.message);
                setLoading(false);
          });
         }
         catch(error){
             console.error('Error fetching notifications:', error);
           setError('Failed to load notifications. Please try again later.');
         setLoading(false);
       }
   };
     fetchNotifications();
       return () => {
          if(unsubscribe) unsubscribe();
        };
   }, [currentUser]);


   if(loading){
      return <p>Loading notifications...</p>;
    }
   if (error) {
        return <p className="error-message">{error}</p>;
    }
    if (notifications.length === 0) {
      return <p>Δεν υπάρχουν ειδοποιήσεις.</p>;
    }

  return (
      <>
          <Navbar />
    <div className="notifications-page">
         <h2>Ειδοποιήσεις</h2>
       <div className='notifications-container'>
            {notifications.map(notification => (
              <div key={notification.id} className='notification-card'>
                  <p>{notification.message}</p>
                    <p className='notification-time'>
                     {formatDistanceToNow(notification.createdAt, {addSuffix: true, locale: el})}
                   </p>
                </div>
            ))}
        </div>
    </div>
      </>
  );
}

export default NotificationsPage;