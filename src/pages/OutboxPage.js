import React, { useState, useEffect, useContext } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './OutboxPage.css';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';


function OutboxPage() {
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
       where('from', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
    );
     const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMessages(messagesData);
    });
      return () => unsubscribe();
    }
    catch(error){
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
      <div className="outbox-page">
        <h2>Outbox</h2>
        <div className="messages-container">
          {messages.length > 0 ? (
             messages.map(message => (
               <div key={message.id} className="message-card">
                  <p><strong>To:</strong> {message.to}</p>
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

export default OutboxPage;