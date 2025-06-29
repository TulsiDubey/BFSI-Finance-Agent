import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import toast from 'react-hot-toast';

const UserContext = createContext();

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [firestoreAvailable, setFirestoreAvailable] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setUser(user);
      
      if (user) {
        try {
          // Check if profile is complete
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data();
            console.log('Profile data:', profileData);
            setUserProfile(profileData);
          } else {
            // Create initial user document if it doesn't exist
            try {
              const initialProfile = {
                email: user.email,
                createdAt: new Date(),
                profileComplete: false,
              };
              await setDoc(doc(db, 'users', user.uid), initialProfile);
              setUserProfile(initialProfile);
            } catch (firestoreError) {
              console.warn('Firestore not available, using local storage fallback');
              setFirestoreAvailable(false);
              // Store profile in localStorage as fallback
              const localProfile = localStorage.getItem(`userProfile_${user.uid}`);
              if (localProfile) {
                const profileData = JSON.parse(localProfile);
                setUserProfile(profileData);
              } else {
                const initialProfile = {
                  email: user.email,
                  createdAt: new Date(),
                  profileComplete: false,
                };
                setUserProfile(initialProfile);
              }
            }
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
          setFirestoreAvailable(false);
          // Fallback to localStorage
          const localProfile = localStorage.getItem(`userProfile_${user.uid}`);
          if (localProfile) {
            const profileData = JSON.parse(localProfile);
            setUserProfile(profileData);
          } else {
            const initialProfile = {
              email: user.email,
              createdAt: new Date(),
              profileComplete: false,
            };
            setUserProfile(initialProfile);
          }
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create initial user document
      try {
        const initialProfile = {
          email: user.email,
          createdAt: new Date(),
          profileComplete: false,
        };
        await setDoc(doc(db, 'users', user.uid), initialProfile);
        setUserProfile(initialProfile);
      } catch (firestoreError) {
        console.warn('Firestore not available, using local storage fallback');
        setFirestoreAvailable(false);
        // Store in localStorage as fallback
        const initialProfile = {
          email: user.email,
          createdAt: new Date(),
          profileComplete: false,
        };
        localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(initialProfile));
        setUserProfile(initialProfile);
      }
      
      toast.success('Account created successfully!');
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists. Please try logging in.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters long.');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else {
        toast.error('Login failed. Please try again.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const saveProfile = async (profileData) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const completeProfileData = {
        ...profileData,
        profileComplete: true,
        updatedAt: new Date(),
      };

      if (firestoreAvailable) {
        await updateDoc(doc(db, 'users', user.uid), completeProfileData);
      } else {
        // Fallback to localStorage
        localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(completeProfileData));
      }

      setUserProfile(completeProfileData);
      toast.success('Profile saved successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedProfileData = {
        ...userProfile,
        ...updates,
        updatedAt: new Date(),
      };

      if (firestoreAvailable) {
        await updateDoc(doc(db, 'users', user.uid), updatedProfileData);
      } else {
        // Fallback to localStorage
        localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(updatedProfileData));
      }

      setUserProfile(updatedProfileData);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
      throw error;
    }
  };

  const clearAllData = async () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear Firestore data if available
      if (firestoreAvailable && user) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date(),
          profileComplete: false,
        });
      }
      
      setUserProfile(null);
      toast.success('All data cleared successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data. Please try again.');
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    firestoreAvailable,
    signup,
    login,
    logout,
    saveProfile,
    updateProfile,
    clearAllData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 