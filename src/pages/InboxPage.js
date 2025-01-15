import React, { useState, useEffect, useContext } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './InboxPage.css';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';


function InboxPage() {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
   const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchMessages();
    }, []);
  const fetchMessages = async () => {
        try{
            const messagesQuery = query(
               collection(db, 'messages'),
                where('to', '==', currentUser.uid),
                 orderBy('createdAt', 'desc')
            );
           const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
              const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setMessages(messagesData);
          });
         return () => unsubscribe();
        }
       catch(error) {
          console.error('Error fetching messages:', error);
          setError('Failed to load messages, please try again later');
        }
    };

  if (error){
    return <p className="error-message">{error}</p>;
 }


  return (
      <>
        <Navbar />
    <div className="inbox-page">
        <h2>Inbox</h2>
      <div className="messages-container">
            {messages.length > 0 ? (
              messages.map(message => (
                  <div key={message.id} className="message-card">
                     <p><strong>From:</strong> {message.from}</p>
                     <p><strong>Subject:</strong> {message.subject}</p>
                      <Link to={`/chat/${message.id}`} className='view-message-button'>View</Link>
                 </div>
                ))
            ) : (
               <p>No messages at the moment</p>
            )}
     </div>
    </div>
      </>
  );
}

export default InboxPage;