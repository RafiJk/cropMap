
//BSD
import React, { useState, useEffect } from "react";
import { QuerySnapshot, getDoc } from 'firebase/firestore';
import { getFirestore, collection, updateDoc, setDoc, doc, onSnapshot, Timestamp, query, orderBy, limit,  getDocs} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useRouter } from 'next/router';
import { countiesListDE, countiesListMD, countiesListPA, countiesListVA, countiesListWV } from "./countiesList";
// import { Header } from "antd/es/layout/layout";
import Header from './components/Header';

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

const stateUrlMap = {"DE": "/theRealStateOfDE.json", "MD": "/theRealStateOfMD.json",
 "WV": "/theRealStateOfWV.json", "VA": "/theRealStateOfVA.json", "PA": "/theRealStateOfPA.json" };

const countiesByState = {"DE": countiesListDE, "MD": countiesListMD, "WV": countiesListWV,
  "VA": countiesListVA, "PA": countiesListPA
};

const CornMapCollection = collection(db, "CornMap");

const updater = () => {

  const [countyData, setCountyData] = useState({}); /* for getting all prev data */
  const [selectedCounty, setSelectedCounty] = useState(null); /* selected county */

  const router = useRouter(); //this gets you the specifics we're working down...this is going to be based off user prob
  const selectedState = router.query.state || null;
  const selectedCrop = router.query.crop || null;
  const selectedPercentType = router.query.percentType || null;

  const countiesList = countiesByState[selectedState] || countiesListMD;
  let url = stateUrlMap[selectedState] || "";

  useEffect(() => {

    const fetchDoc = async () => { //might not want asynch??
      const cmq = query(CornMapCollection, orderBy("date", "desc"), limit(1)) //get most recent doc
      try { 
        const querySnapshot = await getDocs(cmq);
        const snapshot = querySnapshot.docs[0];
        //there used to be a try catch to see if there was a snapshot...i got rid of it... maybe shou;dn thave
        let currentDate = (Math.floor(Date.now())/1000); //where we are currently
        let snapshotDate = await ((snapshot.data().date).seconds); //get DateFrom most recent doc
        const diffInDays = (currentDate - snapshotDate); //do we need to make a newfile
        if ( diffInDays >= 604800){ //rn this is testing if it's less then 7 day
          await makeNewDoc();
        }else{
          fetchCountyData();
        }
      } catch (error) {
        console.error("Error retrieving the most recent document:", error); //this should catch everything
      }
    };

    const makeNewDoc = () => { //access collection and iterate through and create it in form
      // const newMapDocRef = doc(collection(db, "CornMap")); // I think I can cut off a line of code here...if glitches change back
      setDoc(CornMapCollection, { date: Timestamp.now() }).then(async () => {//if glitch change back to newMapDOCREF and uncomunt line above
        const countyHarvestsCollectionRef = collection(newMapDocRef, 'CountyHarvests');
        for (const state in countiesByState) {
          const stateCounties = countiesByState[state];
          for (const county of stateCounties) {
            const newHarvestDocRef = doc(countyHarvestsCollectionRef, county);
            setDoc(newHarvestDocRef, {
              state: state,
              county: county,
              plantedPercent: 0,
              emergencePercent: 0,
              harvestPercent: 0,
            });
          }
        }
      })
      fetchCountyData();
    }

    const fetchCountyData = async () => {

      //next four lines annoying but neccesary...
      //seems I need two calls to get data 1) to get the most recent documetn name
      // 2) use the name to get the id...there may be a more efficient way but idk it rn
      const cmq = query(CornMapCollection, orderBy("date", "desc"), limit(1)); //get the name of the neweset doc 
      const querySnapshot = await getDocs(cmq);
      const mostRecentDocumentName = querySnapshot.docs[0].id.toString(); 
      const documentRef = doc(CornMapCollection, mostRecentDocumentName); //checl to make sure getting right one
      
      try {
        const documentSnapshot = await getDoc(documentRef); // I feel like i get it more times then needed
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
    }
    fetchDoc(); //checks if need new doc
  }, []);

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
  



  return (
    <div>
      <Header></Header>
      <select
        name='counties'
        id='selectedCounty'
        value={selectedCounty}
        onChange={(e) => setSelectedCounty(e.target.value)}
      >
        <option value=''>Select a county</option>
        {countiesList.map((county, index) => (
          <option key={index} value={county}>
            {county}
          </option>
        ))}
      </select>
      {selectedCounty && (
        <div>
          <h3>{selectedCounty}</h3>
          <form>
          <input
                  type="number"
                  name={selectedPercentType}
                  value={countyData[selectedOption]?.[selectedPercentType] || 0}
                  onChange={(event) => handleInputChange(event, selectedOption)}>
            <span>Current Percent: {countyData[selectedOption]?.[selectedPercentType] || 0}% </span> 
            </input>
          </form>
        </div>
      )}
    </div>
  );
};  

export default updater;



// import Header from './components/Header';
// import styles from './addMapDate.module.css';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField'; 
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";
// import { scaleQuantize } from "d3-scale";
// import { Container } from "@mui/material";
