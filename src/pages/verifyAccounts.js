
/* BSD
- NEED TO PREVENT ALL NON ADMINS/AND NON LOGGED IN FROM GETTING IN 
*/
import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { auth, db } from './addMapDates/firebaseConfig.js'; // Import your Firebase auth and Firestore instances
import Header from './components/Header';
import { useRouter } from 'next/router';

const AdminVerificationPage = () => {
  const router = useRouter();
  const [usersToVerify, setUsersToVerify] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch list of users with "verified" field set to false
  useEffect(() => {
    const fetchUsersToVerify = async () => {
      const authUser = auth.currentUser; //Get the logged-in user
      if (authUser) {
        // Check if admin
        const userDocRef = doc(db, 'myUsers', authUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        if (userData && userData.Admin) {
          //User is admin, go ahead
          const usersRef = collection(db, 'myUsers');
          const usersQuery = query(usersRef, where('verified', '==', false));
          const usersSnapshot = await getDocs(usersQuery);
          const usersList = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            email: doc.data().email,
            institution: doc.data().institution,
            credentials: doc.data().credentials,
            verified: doc.data().verified,
          }));
          setUsersToVerify(usersList);
        } else {
          // User is not an admin, go back to login
          router.push('/Auth/LogInPage');
        }
      }
    };

    fetchUsersToVerify();
  }, []);

  const checkAdminStatus = async (userId) => {
    const userDocRef = doc(db, 'myUsers', userId);
    const userDocSnapshot = await getDoc(userDocRef);
    const userData = userDocSnapshot.data();
    return userData && userData.Admin;
  };

  // Handle user verification
  const handleVerifyUser = async () => {
    if (selectedUser) {
      console.log((selectedUser.verified))
      try {
        // Update the selected user's document to set "verified" to true
        await setDoc(doc(db, "myUsers", selectedUser.id), { verified : true }, { merge: true });
        // Remove the user from the list of users to verify
        setUsersToVerify(usersToVerify.filter((user) => user.id !== selectedUser.id));
        setSelectedUser(null); // Reset selected user
      } catch (error) {
        console.error('Error verifying user:', error);
      }
    }
  };

  const backToAdmin = () =>{
    router.push('/adminSelectMapDate');
  }


  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      router.push('/Auth/LogInPage'); // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  

  return (
    <div>
      <Header></Header>
      <h2>Administrator Verification</h2>
      <div>
        <label>Select user to verify:</label>
        <select
          value={selectedUser ? selectedUser.id : ''}
          onChange={(e) => {
            const userId = e.target.value;
            setSelectedUser(usersToVerify.find((user) => user.id === userId));
          }}
        >
          <option value="">Select a user</option>
          {usersToVerify.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>
      {selectedUser && (
        <div>
          <h3>User Information</h3>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Institution:</strong> {selectedUser.institution}</p>
          <p><strong>Credentials:</strong> {selectedUser.credentials}</p>
          <p><strong>Verified:</strong> {selectedUser.verified.toString()}</p>
          <button onClick={handleVerifyUser}>Verify User</button>
        </div>
      )}
     <button onClick={backToAdmin}>GO BACK TO ADMIN CENTRAL</button>
     <button onClick={handleLogout}>Log Out</button> {/* Add logout button */}
    </div>
  );
};

export default AdminVerificationPage;
