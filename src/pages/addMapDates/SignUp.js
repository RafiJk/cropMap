//BSD


/* RIGHT NOW ONLY SELECTS ONE... */


import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import Header from '../components/Header';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'firebase/auth';
import 'firebase/firestore';
import {
  countiesListDE,
  countiesListMD,
  countiesListPA,
  countiesListVA,
  countiesListWV,
} from './countiesList'
import { Router } from 'react-router';

const firebaseConfig = {
  apiKey: "AIzaSyD-LpxW3J2ztr1Q1cE_x8pPHv7JRNa4M9g",
  authDomain: "ag-map-d4af3.firebaseapp.com",
  projectId: "ag-map-d4af3",
  storageBucket: "ag-map-d4af3.appspot.com",
  messagingSenderId: "574258608297",
  appId: "1:574258608297:web:4dc19cc58b6aff298dd1b8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const countiesByState = {"DE": countiesListDE, "MD": countiesListMD, "WV": countiesListWV,
  "VA": countiesListVA, "PA": countiesListPA
};

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCounties, setSelectedCounties] = useState([]);

  const handleSignUp = async () => {
    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create the myUsers collection if it doesn't exist
      const collectionRef = collection(db, "myUsers");
      const collectionSnapshot = await getDocs(collectionRef);
      if (collectionSnapshot.size === 0) {
        await setDoc(doc(db, "myUsers", "initialDoc"), { created: true });
      }

      // Store additional user data in Firestore
      const userData = {
        email: email,
        Admin: false,
        credentials: "I like Ice Cream",
        Instuition: "UMD",
        verified: false,
        selectedState: selectedState,
        selectedCounties: selectedCounties,
        // Other additional fields
      };

      // Store the data in the myUsers collection
      await setDoc(doc(db, "myUsers", userCredential.user.uid), userData);
      Router.push("/");

      // Redirect to another page or perform other actions on successful sign-up
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div>
      <Header></Header>
      <h2>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        <option value="">Select a state</option>
        <option value="DE">Delaware</option>
        <option value="MD">Maryland</option>
        <option value="PA">Pennsylvania</option>
        <option value="VA">Virginia</option>
        <option value="WV">West Virginia</option>
      </select>
      <select
        multiple
        value={selectedCounties}
        onChange={(e) =>
          setSelectedCounties(
            Array.from(e.target.selectedOptions, (option) => option.value)
          )
        }
      >
        {countiesByState[selectedState]?.map((county) => (
          <option key={county} value={county}>
            {county}
          </option>
        ))}
      </select>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;