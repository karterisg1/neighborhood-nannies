import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);


    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
       window.addEventListener('offline', handleOffline);
      return () => {
       window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
     };
    }, []);
  useEffect(() => {
       const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if(user){
             if(isOnline){
               try{
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                   if(userDoc.exists()){
                        setCurrentUser({...user, role: userDoc.data().role});
                   }
                   else {
                       setCurrentUser(user);
                  }
                } catch(error){
                  console.error("Error getting user doc:", error);
                   setCurrentUser({...user, role: null});
              }
            } else {
               setCurrentUser(user);
          }
         } else{
                setCurrentUser(null);
           }
           setLoading(false);
      });
     return unsubscribe;
    }, [isOnline]);


    const register = async (email, password, firstName, lastName, role) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
           const user = userCredential.user;
            await updateProfile(user, { displayName: `${firstName} ${lastName}`});
            await setDoc(doc(db, 'users', user.uid), {
               firstName: firstName,
              lastName: lastName,
               email: email,
               role: role
           });
            return { user, role, error: null };
        } catch (error) {
            return { user: null, role: null, error: error.message };
        }
    };

    const login = async (email, password) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if(isOnline){
                const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
                return { user: {...userCredential.user, role: userDoc.exists() ? userDoc.data().role : null }, error: null };
            }
          return { user: {...userCredential.user, role: null }, error: null };
      } catch (error) {
            return {user: null, role: null, error: error.message };
        }
    };

   const taxisnetLogin = async (email, password) => {
       //Simulate authentication,
        try {
           // The following are temporary values to simulate logging in using Taxisnet, you need to call the real API in the backend
            const user = {
               uid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                displayName: 'Taxisnet User',
                email: email
            };
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if(isOnline){
                return {user: {...user, role: userDoc.exists() ? userDoc.data().role : null }, error: null };
           }
           return {user: {...user, role: null}, error: null}
        } catch (error) {
            console.error('Error with Taxisnet login:', error);
            return {user: null, role: null, error: "Failed to log in with taxisnet." };
       }
   };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };


    const value = {
        currentUser,
        loading,
        register,
        login,
        taxisnetLogin,
        logout
    };


    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}


export default AuthContext;