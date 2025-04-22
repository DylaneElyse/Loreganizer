"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleAuthRedirect = async (
    authFunction,
    email,
    password,
    additionalData
  ) => {
    try {
      // Pass auth instance as first argument
      const userCredential = await authFunction(auth, email, password);
      const user = userCredential.user;

      if (additionalData.firstName && additionalData.lastName) {
        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          firstName: additionalData.firstName,
          lastName: additionalData.lastName,
          email: user.email,
          createdAt: new Date(),
        });
      }

      router.push("/");
    } catch (error) {
      console.error("Error during authentication:", error.message);
      if (error.code === "auth/password-does-not-meet-requirements") {
        alert(
          "Password does not meet requirements. Please check and try again."
        );
      } else if (error.code === "auth/user-not-found") {
        alert("User not found. Please sign up first.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/email-already-in-use") {
        alert("Email already in use. Please log in or use a different email.");
      } else if (error.code === "auth/weak-password") {
        alert("Weak password. Please use a stronger password.");
      } else if (error.code === "auth/invalid-password") {
        alert("Invalid password. Please check and try again.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format. Please check and try again.");
      }
      throw error;
    }
  };

  const signUp = (email, password, firstName, lastName) => {
    return handleAuthRedirect(createUserWithEmailAndPassword, email, password, {
      firstName,
      lastName,
    });
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
