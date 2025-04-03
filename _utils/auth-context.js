"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleAuthRedirect = async (authFunction, email, password) => {
    try {
      // Pass auth instance as first argument
      await authFunction(auth, email, password);
      router.push('/');
    } catch (error) {
      console.error("Error during authentication:", error.message);
      throw error;
    }
  }

  const signUp = (email, password) => {
    return handleAuthRedirect(createUserWithEmailAndPassword, email, password);
  };

  const logIn = (email, password) => {
    return handleAuthRedirect(signInWithEmailAndPassword, email, password);
  };

  const firebaseSignOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []); 

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, firebaseSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};

// "use client";

// import { useContext, createContext, useState, useEffect } from "react";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { auth } from "./firebase";
// import { useRouter } from "next/navigation";

// const AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   const handleAuthRedirect = async (authFunction, email, password) => {
//     try {
//       await authFunction(email, password);
//       router.push('/');
//     } catch (error) {
//       console.error("Error during authentication:", error.message);
//       throw error; // Re-throw the error to handle it in the component
//     }
//     }

//   const signUp = (email, password) => {
//     handleAuthRedirect(createUserWithEmailAndPassword, email, password);
//   };

//   const logIn = (email, password) => {
//     return handleAuthRedirect(signInWithEmailAndPassword, email, password);
//   };

//   const firebaseSignOut = () => {
//     return signOut(auth);
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []); 

//   return (
//     <AuthContext.Provider value={{ user, signUp, logIn, firebaseSignOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useUserAuth = () => {
//   return useContext(AuthContext);
// };