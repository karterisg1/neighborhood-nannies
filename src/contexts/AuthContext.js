import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, updateProfile} from 'firebase/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
    });

        return unsubscribe;
    }, []);

    const register = async (email, password, firstName, lastName) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          await updateProfile(user, { displayName: `${firstName} ${lastName}`});
          return { user, error: null };
        } catch (error) {
          return { user: null, error: error.message };
        }
      };

    const login = async (email, password) => {
        try {
           const userCredential = await signInWithEmailAndPassword(auth, email, password);
           return { user: userCredential.user, error: null };
        } catch (error) {
            return {user: null, error: error.message };
        }
    };
    const googleLogin = async () => {
        try{
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            return { user: userCredential.user, error: null }
        }
        catch(error){
            return {user: null, error: error.message};
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
        googleLogin,
        logout
    };


    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}


export default AuthContext;