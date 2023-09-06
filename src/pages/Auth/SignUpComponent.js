//BSD

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/firestore';
import {
  countiesListDE,
  countiesListMD,
  countiesListPA,
  countiesListVA,
  countiesListWV,
} from '../addMapDates/countiesList'
import { useRouter } from 'next/router';
import { auth, db } from '../../firebase'; 



const countiesByState = {"DE": countiesListDE, "MD": countiesListMD, "WV": countiesListWV,
  "VA": countiesListVA, "PA": countiesListPA
};

const SignUp = () => {
  const router = useRouter();

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
      router.push("../");

      // Redirect to another page or perform other actions on successful sign-up
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div>
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

export {SignUp};