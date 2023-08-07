import React, { useState, useEffect } from "react";
import { getDoc } from 'firebase/firestore';
import { getFirestore, collection, updateDoc, setDoc, doc, Timestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useRouter } from 'next/router';
import Header from '../../pages/components/Header';
import Link from 'next/link';
import styles from './addMapDate.module.css';


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


const cropMaps = {
  wheat: {
    collection: collection(db, "WheatMap"),
  },
  corn: {
    collection: collection(db, "CornMap"),
  },
  soy: {
    collection: collection(db, "SoyMap"),
  },
};

const countiesList = [
  'Allegany', 'Anne Arundel', 'Baltimore', 'Calvert', 'Caroline',
  'Carroll', 'Cecil', 'Charles', 'Dorchester', 'Frederick', 'Garrett',
  'Harford', 'Howard', 'Kent', 'Montgomery', 'Prince George\'s',
  'Queen Anne\'s', 'St. Mary\'s', 'Somerset', 'Talbot', 'Washington',
  'Wicomico', 'Worcester', 'Baltimore City',
];



const getMapQuery = (crop) => query(cropMaps[crop].collection, orderBy("date", "desc"), limit(1));

const mostRecentDocument = async (mapQuery) => {
  try {
    const querySnapshot = await getDocs(mapQuery);
    const snapshot = querySnapshot.docs[0];
    if (snapshot) {
      const currentDate = new Date();
      const snapshotDate = new Date(snapshot.data().date);
      const diffInDays = (currentDate - snapshotDate) / (24 * 60 * 60 * 1000);
      return diffInDays >= 7;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error retrieving the most recent document:", error);
    return false;
  }
};

const NewDocMaker = (crop) => {
  const newMapDocRef = doc(cropMaps[crop].collection);
  setDoc(newMapDocRef, { date: Timestamp.now() }).then(() => {
    const countyHarvestsCollectionRef = collection(newMapDocRef, 'CountyHarvests');
    for (const county of countiesList) {
      const newHarvestDocRef = doc(countyHarvestsCollectionRef, county);
      setDoc(newHarvestDocRef, {
        county: county,
        plantedPercent: 0,
        emergencePercent: 0,
        harvestPercent: 0,
      });
    }
  });
  return false;
};

const AddHarvest = ({ crop }) => {
  const [loading, setLoading] = useState(true);
  const [steptwo, setSteptwo] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [countyData, setCountyData] = useState({});



  useEffect(() => {
    const fetchData = async () => {
      const stepone = await mostRecentDocument(getMapQuery(crop));
      let steptwo;

      if (stepone == true) {
        steptwo = NewDocMaker(crop);
      } else {
        steptwo = stepone;
      }

      setSteptwo(steptwo);
      setLoading(false);
    };

    const fetchCountyData = async () => {
      const mostRecentName = await getDocumentName(crop);
      const documentRef = doc(cropMaps[crop].collection, mostRecentName);

      try {
        const documentSnapshot = await getDoc(documentRef);
        const countyDataFromDocument = {};

        if (documentSnapshot.exists()) {
          const countyHarvestsCollectionRef = collection(documentRef, 'CountyHarvests');

          for (const county of countiesList) {
            const countyDocumentRef = doc(countyHarvestsCollectionRef, county);
            const countyDocumentSnapshot = await getDoc(countyDocumentRef);

            if (countyDocumentSnapshot.exists()) {
              const { harvestPercent, emergencePercent, plantedPercent } = countyDocumentSnapshot.data();
              countyDataFromDocument[county] = {
                harvestPercent,
                emergencePercent,
                plantedPercent,
              };
            }
          }
        }

        setCountyData(countyDataFromDocument);
      } catch (error) {
        console.error('Error fetching county data:', error);
      }
    };

    fetchData();
    fetchCountyData();
  }, [crop]);

  const getDocumentName = async (crop) => {
    try {
      const querySnapshot = await getDocs(getMapQuery(crop));
      if (!querySnapshot.empty) {
        const recentDocument = querySnapshot.docs[0];
        return recentDocument.id.toString();
      } else {
        console.log(`No documents found in ${crop} collection.`);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const updateHarvest = async (county) => {
    const mostRecentName = await getDocumentName(crop);
    const documentRef = doc(cropMaps[crop].collection, mostRecentName);
    const countyDocumentRef = doc(collection(documentRef, 'CountyHarvests'), county);

    try {
      const countyDocumentSnapshot = await getDoc(countyDocumentRef);

      if (countyDocumentSnapshot.exists()) {
        await updateDoc(countyDocumentRef, countyData[county]);
        console.log('Harvest percent updated successfully.');
      } else {
        console.log('County document does not exist.');
      }
    } catch (error) {
      console.error('Error updating harvest percent:', error);
    }
  };

  const handleUpdateClick = async (county) => {
    setIsUpdating(true);
    await updateHarvest(county);
    setIsUpdating(false);
  };

  const handleInputChange = (event, county) => {
    const { name, value } = event.target;
    setCountyData((prevData) => ({
      ...prevData,
      [county]: {
        ...prevData[county],
        [name]: Number(value),
      },
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Header />
      {countiesList.map((county) => (
        <div key={county}>
          <h2>{county}</h2>
          <form>
            <div className={styles.inputContainer}>
            <label>Harvest Percent:</label>
              <input
                type="number"
                name="harvestPercent"
                value={countyData[county]?.harvestPercent || 0}
                onChange={(event) => handleInputChange(event, county)}
              />
              <span className={styles.currentPercent}>
                Current Percent: {countyData[county]?.harvestPercent || 0}%
              </span>
            </div>
            <div className={styles.inputContainer}>
              <label>Emergence Percent:</label>
              <input
                type="number"
                name="emergencePercent"
                value={countyData[county]?.emergencePercent || 0}
                onChange={(event) => handleInputChange(event, county)}
              />
              <span className={styles.currentPercent}>
                Current Percent: {countyData[county]?.emergencePercent || 0}%
              </span>
            </div>
            <div className={styles.inputContainer}>
              <label>Planted Percent:</label>
              <input
                type="number"
                name="plantedPercent"
                value={countyData[county]?.plantedPercent || 0}
                onChange={(event) => handleInputChange(event, county)}
              />
              <span className={styles.currentPercent}>
                Current Percent: {countyData[county]?.plantedPercent || 0}%
              </span>
            </div>
            <button type="submit" onClick={() => router.push("/")}>
              Submit
            </button>
            <button onClick={() => handleUpdateClick(county)} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Harvest Percent'}
            </button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default AddHarvest;
