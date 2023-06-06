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
  const [crop, setCrop] = useState('corn');
  const [percentValues, setPercentValues] = useState(Array(24).fill({harvestPercent: 1, emergencePercent: 1, plantedPercent: 1}));

  const handlePercentChange = (event, index, field) => {
    let newPercentValues = [...percentValues];
    newPercentValues[index] = { ...newPercentValues[index], [field]: parseFloat(event.target.value)};
    setPercentValues(newPercentValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const db = getFirestore();
    const newMapDocRef = doc(collection(db, `${crop.charAt(0).toUpperCase()}${crop.slice(1)}Map`));
    await setDoc(newMapDocRef, { date: Timestamp.now() });

    const countyHarvestsCollectionRef = collection(newMapDocRef, 'CountyHarvests');

    countiesList.forEach(async (county, index) => {
      await addDoc(countyHarvestsCollectionRef, {
        county: county,
        harvestPercent: percentValues[index].harvestPercent,
        emergencePercent: percentValues[index].emergencePercent,
        plantedPercent: percentValues[index].plantedPercent,
      });
    });

    alert('New date with CountyHarvests added!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Crop Type:</label>
      <select value={crop} onChange={(e) => setCrop(e.target.value)}>
        <option value="corn">Corn</option>
        <option value="wheat">Wheat</option>
        <option value="soy">Soy</option>
      </select>
      {countiesList.map((county, index) => (
        <div key={index}>
          <label>{county} Harvest Percent:</label>
          <input 
            type="number"
            value={percentValues[index].harvestPercent}
            onChange={(event) => handlePercentChange(event, index, 'harvestPercent')}
          />
          <label>{county} Emergence Percent:</label>
          <input 
            type="number"
            value={percentValues[index].emergencePercent}
            onChange={(event) => handlePercentChange(event, index, 'emergencePercent')}
          />
          <label>{county} Planted Percent:</label>
          <input 
            type="number"
            value={percentValues[index].plantedPercent}
            onChange={(event) => handlePercentChange(event, index, 'plantedPercent')}
          />
        </div>
      ))}
      <button type="submit">Add New Date</button>
    </form>
  );
};

export default AddMapDate;
