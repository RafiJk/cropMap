import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './addMapDates/firebaseConfig.js'; // Import your Firebase auth and firestore instances
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore'; // Import the necessary firestore functions
import Header from './components/Header';

const LogIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Get user data from Firestore
      const userDocRef = doc(db, 'myUsers', auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const isAdmin = userData.Admin || false;
        const isVerified = userData.verified;

        // Redirect based on admin status
        if (isAdmin) {
          router.push('/adminSelectMapDate'); // Replace with your admin page route
          //make sure only a addmin can get in...I'm also not technichally verified but that's ok
          
        } else if(isVerified) {
          router.push('./selectedMapDatePlebian'); // Replace with your regular user page route
          //make sure a non verified user cannot get in!
        } else{
          console.log("Your not Sign Up or Verified error message needs to pop up @Yoni Singer")        
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const goToSignUp = () =>{
    router.push('./addMapDates/SignUp')
  }


  return (
    <div>
      <Header></Header>
      <h2>Log In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogIn}>Log In</button>
      <div className ="redirectToSignUp">
        <p>New To The Map click here to sign up</p>
        <button onClick ={goToSignUp}>SignUpPage</button>
      </div>
    </div>
  );
};

export default LogIn;
