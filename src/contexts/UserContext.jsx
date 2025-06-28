import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
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
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [firestoreAvailable, setFirestoreAvailable] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Check for test user first
    const testUser = localStorage.getItem('testUser');
    if (testUser) {
      const testUserData = JSON.parse(testUser);
      setUser({ uid: testUserData.uid, email: testUserData.email });
      setUserProfile(testUserData);
      setProfileComplete(testUserData.profileComplete || false);
      setIsTestMode(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // Check if profile is complete
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data();
            setUserProfile(profileData);
            setProfileComplete(profileData.profileComplete || false);
          } else {
            // Create initial user document if it doesn't exist
            try {
              await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                createdAt: new Date(),
                profileComplete: false,
              });
              setProfileComplete(false);
            } catch (firestoreError) {
              console.warn('Firestore not available, using local storage fallback');
              setFirestoreAvailable(false);
              // Store profile in localStorage as fallback
              const localProfile = localStorage.getItem(`userProfile_${user.uid}`);
              if (localProfile) {
                const profileData = JSON.parse(localProfile);
                setUserProfile(profileData);
                setProfileComplete(profileData.profileComplete || false);
              } else {
                setProfileComplete(false);
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
            setProfileComplete(profileData.profileComplete || false);
          } else {
            setProfileComplete(false);
          }
        }
      } else {
        setProfileComplete(false);
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
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date(),
          profileComplete: false,
        });
      } catch (firestoreError) {
        console.warn('Firestore not available, using local storage fallback');
        setFirestoreAvailable(false);
        // Store in localStorage as fallback
        localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify({
          email: user.email,
          createdAt: new Date(),
          profileComplete: false,
        }));
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
      if (isTestMode) {
        localStorage.removeItem('testUser');
        setUser(null);
        setProfileComplete(false);
        setUserProfile(null);
        setIsTestMode(false);
        toast.success('Logged out successfully!');
        return;
      }
      
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const saveProfile = async (profileData) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      if (isTestMode) {
        // Save to localStorage for test mode
        const updatedProfile = {
          ...profileData,
          profileComplete: true,
          updatedAt: new Date(),
        };
        localStorage.setItem('testUser', JSON.stringify({
          uid: user.uid,
          email: user.email,
          ...updatedProfile
        }));
        setUserProfile(updatedProfile);
        setProfileComplete(true);
        toast.success('Profile saved successfully!');
        return;
      }
      
      if (firestoreAvailable) {
        const profileRef = doc(db, 'users', user.uid);
        await updateDoc(profileRef, {
          ...profileData,
          profileComplete: true,
          updatedAt: new Date(),
        });
      } else {
        // Store in localStorage as fallback
        localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify({
          ...profileData,
          profileComplete: true,
          updatedAt: new Date(),
        }));
      }
      
      setUserProfile(profileData);
      setProfileComplete(true);
      toast.success('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
      throw error;
    }
  };

  const value = {
    user,
    profileComplete,
    loading,
    userProfile,
    firestoreAvailable,
    isTestMode,
    signup,
    login,
    logout,
    saveProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 