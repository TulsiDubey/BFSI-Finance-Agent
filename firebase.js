"use client"
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2QdLSfYX587yackaTTUtx_D_MLoLcvS4",
  authDomain: "bfsi-fraud-detection-app.firebaseapp.com",
  projectId: "bfsi-fraud-detection-app",
  storageBucket: "bfsi-fraud-detection-app.firebasestorage.app",
  messagingSenderId: "73965566370",
  appId: "1:73965566370:web:7326e3529b30a08cde5afb",
  measurementId: "G-HJ3HSCNXMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firebase functions for user management
export const saveUserProfile = async (uid, profileData) => {
  try {
    await setDoc(doc(db, "users", uid), {
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("Profile saved successfully to Firebase for UID:", uid);
    return { success: true };
  } catch (error) {
    console.error("Error saving user profile:", error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "Profile not found" };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (uid, updates) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }
};