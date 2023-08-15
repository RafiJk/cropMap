import React, { useState, useEffect } from "react";
import { getDoc } from 'firebase/firestore';
import { getFirestore, collection, updateDoc, setDoc, doc, Timestamp, query, orderBy, limit,  getDocs} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useRouter } from 'next/router';
import Header from '../components/Header';
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

const SoyMapCollection = collection(db, "SoyMap");
const countiesList = [
  'Allegany', 'Anne Arundel', 'Baltimore', 'Calvert', 'Caroline',
  'Carroll', 'Cecil', 'Charles', 'Dorchester', 'Frederick', 'Garrett',
  'Harford', 'Howard', 'Kent', 'Montgomery', 'Prince George\'s',
  'Queen Anne\'s', 'St. Mary\'s', 'Somerset', 'Talbot', 'Washington',
  'Wicomico', 'Worcester', 'Baltimore City',
];


const mostRecentDocument = async (smq) => {
  try { //the dates aren't valid...eitehr of them
    const querySnapshot = await getDocs(smq);
    const snapshot = querySnapshot.docs[0];
    if (snapshot) {
      let currentDate = Date.now();
      currentDate = Math.floor(currentDate)/1000;
      console.log(currentDate);
      // console.log(currentDate);
      let snapshotDate = await (snapshot.data().date);
      snapshotDate = snapshotDate.seconds;
      console.log(snapshotDate);
      const diffInDays = (currentDate - snapshotDate);
      console.log(diffInDays); //why do i keep getting 43000
       if(!snapshotDate){
        console.error("Error retrieving the most recent document:", error);
       }
      // const diffInDays = 0;
      if ( diffInDays >= 604800){ //rn this is testing if it's less then 7 day
        console.log('what');
        return true;
      }else{
        return false;
      }
    } else {
      console.log('hey');
      return false;
    }
  } catch (error) {
    console.error("Error retrieving the most recent document:", error);
    return false;
  }
};

const NewDocMaker = () => {
  const newMapDocRef = doc(collection(db, "SoyMap"));
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
  return true;
};

const AddHarvest = () => {
  const [loading, setLoading] = useState(true);
  // const [steptwo, setSteptwo] = useState(false);
  const steptwo = false;
  const [isUpdating, setIsUpdating] = useState(false);

  const [countyData, setCountyData] = useState({});

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const SoyMapQuery = query(SoyMapCollection, orderBy("date", "desc"), limit(1));
      const stepone = await mostRecentDocument(SoyMapQuery);
      let steptwo;
      if (stepone === true) {
        steptwo = NewDocMaker();
      } else {
        steptwo = false;
      }
      // setSteptwo(steptwo);
      setLoading(false);
    };

    const fetchCountyData = async () => {
      let mostRecentName = await getDocumentName();
      
      if (steptwo === true) {
        // If a new document was created, fetch the newly created document instead
        const cmq = query(SoyMapCollection, where("id", "==", mostRecentName));
        const querySnapshot = await getDocs(cmq);
        if (!querySnapshot.empty) {
          const recentDocument = querySnapshot.docs[0];
          mostRecentName = recentDocument.id.toString();
        }
      }
      const documentRef = doc(SoyMapCollection, mostRecentName);

      try {
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
          const countyHarvestsCollectionRef = collection(documentRef, 'CountyHarvests');
          const countyDataPromises = [];

          for (const county of countiesList) {
            const countyDocumentRef = doc(countyHarvestsCollectionRef, county);
            countyDataPromises.push(getDoc(countyDocumentRef));
          }

          const countyDataSnapshots = await Promise.all(countyDataPromises);
          const countyDataFromDocument = {};

          countyDataSnapshots.forEach((snapshot, index) => {
            if (snapshot.exists()) {
              const { harvestPercent, emergencePercent, plantedPercent } = snapshot.data();
              const county = countiesList[index];

              countyDataFromDocument[county] = {
                harvestPercent,
                emergencePercent,
                plantedPercent,
              };
            }
          });

          setCountyData(countyDataFromDocument);
        }
      } catch (error) {
        console.error('Error fetching county data:', error);
      }
    };

    fetchData();
    fetchCountyData();
  }, []);
  
  const getDocumentName = async () => {
    try {
      const cmq = query(SoyMapCollection, orderBy("date", "desc"), limit(1)); 
      const querySnapshot = await getDocs(cmq);
      if (!querySnapshot.empty) {
        const recentDocument = querySnapshot.docs[0];
        console.log(recentDocument.id.toString());
        return recentDocument.id.toString();
      } else {
        console.log('No documents found in SoyMap collection.');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const updateHarvest = async (county) => {
    const mostRecentName = await getDocumentName();
    const documentRef = doc(SoyMapCollection, mostRecentName);
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


  const handleUpdateClick = async () => {
    for (const county of countiesList){ 
      setIsUpdating(true);
      await updateHarvest(county);
      setIsUpdating(false);
    }
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
      <Header/>
      {countiesList.map((county) => (
        <div key={county}>
          <h2>{county}</h2>
          <form>
            <div className={styles.inputContainer}>
              <label>Harvest Percent:</label>
              <input
                type="number"
                name="harvestPercent"
                value={countyData[county]?.harvestPercent || 0} //the first part is the slow dwon 
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
          </form>
        </div>
      ))}
        <button onClick={() => handleUpdateClick()} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Harvest Percent'}
         </button>
        <button type="Return To Home" onClick={() => router.push("/")} >
          Return To Home
        </button>
    </div>
  );
};

export default AddHarvest;

