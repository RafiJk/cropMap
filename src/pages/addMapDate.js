import React, { useState } from "react";
import { getFirestore, collection, addDoc, setDoc, doc, Timestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyD-LpxW3J2ztr1Q1cE_x8pPHv7JRNa4M9g",
  authDomain: "ag-map-d4af3.firebaseapp.com",
  projectId: "ag-map-d4af3",
  storageBucket: "ag-map-d4af3.appspot.com",
  messagingSenderId: "574258608297",
  appId: "1:574258608297:web:4dc19cc58b6aff298dd1b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const countiesList = [
  'Allegany',
  'Anne Arundel',
  'Baltimore',
  'Calvert',
  'Caroline',
  'Carroll',
  'Cecil',
  'Charles',
  'Dorchester',
  'Frederick',
  'Garrett',
  'Harford',
  'Howard',
  'Kent',
  'Montgomery',
  'Prince George\'s',
  'Queen Anne\'s',
  'St. Mary\'s',
  'Somerset',
  'Talbot',
  'Washington',
  'Wicomico',
  'Worcester',
  'Baltimore City',
];

const AddMapDate = () => {
  const [percentValues, setPercentValues] = useState(Array(24).fill(1)); // Default percent value is 1

  const handlePercentChange = (event, index) => {
    let newPercentValues = [...percentValues];
    newPercentValues[index] = event.target.value;
    setPercentValues(newPercentValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const db = getFirestore();
    const newMapDocRef = doc(collection(db, 'Map'));
    await setDoc(newMapDocRef, { date: Timestamp.now() });

    const countyHarvestsCollectionRef = collection(newMapDocRef, 'CountyHarvests');

    countiesList.forEach(async (county, index) => {
      await addDoc(countyHarvestsCollectionRef, {
        county: county,
        percent: parseFloat(percentValues[index]),
      });
    });

    alert('New date with CountyHarvests added!');
  };

  return (
    <form onSubmit={handleSubmit}>
      {countiesList.map((county, index) => (
        <div key={index}>
          <label>{county} Percent:</label>
          <input 
            type="number"
            value={percentValues[index]}
            onChange={(event) => handlePercentChange(event, index)}
          />
        </div>
      ))}
      <button type="submit">Add New Date</button>
    </form>
  );
};

export default AddMapDate;