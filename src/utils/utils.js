import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
export function formatDate(date) {
    return new Date(date).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
 export function generateChatId(userId1, userId2) {
      const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}-${sortedIds[1]}`;
  }

  export const createNotification = async (userId, message) => {
     try {
        const notificationCollection = collection(db, 'notifications');
           await addDoc(notificationCollection, {
             userId: userId,
            message: message,
           createdAt: serverTimestamp(),
       });
        } catch (error) {
             console.error('Error creating notification:', error);
        }
  };