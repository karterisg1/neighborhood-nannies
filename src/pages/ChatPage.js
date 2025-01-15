import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, onSnapshot, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './ChatPage.css';
import Navbar from '../components/Navbar';
import { generateChatId } from '../utils/utils';

function ChatPage() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);
    const chatId = generateChatId(currentUser.uid, id);


    useEffect(() => {
        fetchMessages();
    }, [chatId]);

    const fetchMessages = async () => {
       try{
          const messageQuery = query(
           collection(db, 'messages', chatId, 'chat'),
           orderBy('createdAt', 'asc')
        );
           const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
             const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
             setMessages(messagesData);
           });
          return () => unsubscribe();
        }
        catch (error){
           console.error("Error fetching messages:", error);
            setError('Failed to load messages, please try again later');
       }
  };

    const handleSendMessage = async () => {
        if(!newMessage){
            return;
        }
       try {
           const messageCollection = collection(db, 'messages', chatId, 'chat');
            await addDoc(messageCollection, {
               from: currentUser.uid,
                to: id,
                text: newMessage,
                createdAt: serverTimestamp(),
            });
           setNewMessage('');
         } catch(error){
            console.error("Error sending message:", error);
           setError("Failed to send the message. Please try again later");
        }
    };
  if(error){
    return <p className="error-message">{error}</p>;
  }

  return (
      <>
          <Navbar />
    <div className="chat-page">
        <div className="messages-container">
            {messages.map(message => (
                <div
                    key={message.id}
                   className={`message ${message.from === currentUser.uid ? 'sent' : 'received'}`}
                >
                   <p>{message.text}</p>
               </div>
            ))}
        </div>
        <div className="input-area">
          <input
             type="text"
            value={newMessage}
             onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
           />
         <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      </>
  );
}

export default ChatPage;