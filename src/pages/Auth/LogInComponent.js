import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase'; // Import your Firebase auth and firestore instances
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore'; // Import the necessary firestore functions
import { useUpdater } from '../../userContext';

const LogIn = () => {
  const router = useRouter();
  const {
    setAdmin,
    setVerified,
  } = useUpdater();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const userDocRef = doc(db, 'myUsers', auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const isAdmin = userData.Admin? true : false;
        const isVerified = userData.verified;
        setAdmin(isAdmin); 
        setVerified(isVerified);

        // Redirect based on admin status
        if (isVerified) {
          console.log('You are signed up and verified!');
          router.push({
            pathname: '../selectedMapDatePlebian',
          });
        } else {
          console.log("You're not signed up or verified. Error message needs to pop up @Yoni Singer");
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const goToSignUp = () =>{
    router.push('./SignUpPage')
  }


  return (
    <div>
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

export {LogIn};


