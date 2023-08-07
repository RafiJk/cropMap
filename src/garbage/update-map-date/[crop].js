import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc, setDoc, doc, Timestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore, collectionGroup, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-LpxW3J2ztr1Q1cE_x8pPHv7JRNa4M9g",
  authDomain: "ag-map-d4af3.firebaseapp.com",
  projectId: "ag-map-d4af3",
  storageBucket: "ag-map-d4af3.appspot.com",
  messagingSenderId: "574258608297",
  appId: "1:574258608297:web:4dc19cc58b6aff298dd1b8"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const UpdateMapDate = () => {
  const router = useRouter();
  const { crop } = router.query;
  const [countyData, setCountyData] = useState({});

  useEffect(() => {
    const fetchCountyData = async () => {
      if (crop) {
        const collectionName = crop.charAt(0).toUpperCase() + crop.slice(1) + 'Map';
        const countyHarvestsRef = collectionGroup(db, 'CountyHarvests');
        const querySnapshot = await getDocs(query(countyHarvestsRef, where('crop', '==', crop)));

        const data = {};
        querySnapshot.forEach((doc) => {
          const county = doc.id;
          data[county] = doc.data();
        });

        setCountyData(data);
      }
    };

    fetchCountyData();
  }, [crop]);

  const handlePercentChange = (event, field, county) => {
    const updatedCountyData = { ...countyData };
    updatedCountyData[county][field] = parseFloat(event.target.value);
    setCountyData(updatedCountyData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const collectionName = crop.charAt(0).toUpperCase() + crop.slice(1) + 'Map';
    const collectionRef = collection(db, collectionName);

    const promises = Object.entries(countyData).map(([county, data]) => {
      const countyRef = doc(collectionRef, 'CountyHarvests', county);
      return setDoc(countyRef, data, { merge: true });
    });

    await Promise.all(promises);

    alert('New date with CountyHarvests added!');
    router.push('/');
  };

  return (
    <div>
      <h1>Update {crop} Harvest</h1>
      <form onSubmit={handleSubmit}>
        {Object.entries(countyData).map(([county, data]) => (
          <div key={county}>
            <h2>{county}</h2>
            <div>
              <label>Harvest Percent:</label>
              <input
                type="number"
                placeholder="Harvest Percent"
                value={data.harvestPercent}
                onChange={(event) => handlePercentChange(event, 'harvestPercent', county)}
              />
            </div>
            <div>
              <label>Emergence Percent:</label>
              <input
                type="number"
                placeholder="Emergence Percent"
                value={data.emergencePercent}
                onChange={(event) => handlePercentChange(event, 'emergencePercent', county)}
              />
            </div>
            <div>
              <label>Planted Percent:</label>
              <input
                type="number"
                placeholder="Planted Percent"
                value={data.plantedPercent}
                onChange={(event) => handlePercentChange(event, 'plantedPercent', county)}
              />
            </div>
          </div>
        ))}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateMapDate;
