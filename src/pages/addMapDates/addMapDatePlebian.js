
//BSD
//OK LET'S MAKE THIS SECURE

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, limit, orderBy, doc, Timestamp, setDoc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { auth, db } from './firebaseConfig.js'; //
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Correct import
// import mapChart from './mapChart';


import { useRouter } from 'next/router';
import {
  countiesListDE,
  countiesListMD,
  countiesListPA,
  countiesListVA,
  countiesListWV,
} from './countiesList.js';

import Header from '../components/Header.js';
import LogIn from '../LogUp.js'; // I Dont know why it has an error with login but it does so it's logUp now...sue me
import SignUp from './SignUp.js'; // 



const stateUrlMap = {"DE": "/theRealStateOfDE.json", "MD": "/theRealStateOfMD.json",
 "WV": "/theRealStateOfWV.json", "VA": "/theRealStateOfVA.json", "PA": "/theRealStateOfPA.json" };

const countiesByState = {"DE": countiesListDE, "MD": countiesListMD, "WV": countiesListWV,
  "VA": countiesListVA, "PA": countiesListPA
};




const Updater = () => {


  const router = useRouter();
  const selectedState = router.query.state || null;
  const selectedCrop = router.query.crop || null;
  const selectedPercentType = router.query.percentType || 0;
  console.log(selectedPercentType);
  const cropMapCollection = collection(db, (`${selectedCrop}Map`).toString());

  const [user, setUser] = useState(null); // Store user information
  const [countyData, setCountyData] = useState({});
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userSelectedCounties, setUserSelectedCounties] = useState([]);


 
  const countiesList = userSelectedCounties || [];
  let url = stateUrlMap[selectedState] || '';

 

  useEffect(() => {
    // Subscription to listen for authentication state changes

    const fetchDoc = async () => { //might not want asynch??
      const cmq = query(cropMapCollection, orderBy("date", "desc"), limit(1)) //get most recent doc
      try { 
        const querySnapshot = await getDocs(cmq);
        const snapshot = querySnapshot.docs[0];
        //there used to be a try catch to see if there was a snapshot...i got rid of it... maybe shou;dn thave
        let currentDate = (Math.floor(Date.now())/1000); //where we are currently
        let snapshotDate = await ((snapshot.data().date).seconds); //get DateFrom most recent doc
        const diffInDays = (currentDate - snapshotDate); //do we need to make a newfile
        if ( diffInDays >= 604800){ //rn this is testing if it's less then 7 day
          console.log('here goof')
          makeNewDoc();
        }else{
          console.log('here bad')
          fetchCountyData();
        }
      } catch (error) {
        console.error("Error retrieving the most recent document:", error); //this should catch everything
      }
    };

    const makeNewDoc = () => { //access collection and iterate through and create it in form
      const newMapDocRef = doc(collection(db,(`${selectedCrop}Map`).toString())); 
      setDoc(newMapDocRef, { date: Timestamp.now() }).then(() => {
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
      if (!user) {
        return; // If user is not signed in, exit the function
      }
      const cmq = query(cropMapCollection, orderBy('date', 'desc'), limit(1));
      const querySnapshot = await getDocs(cmq);
      const mostRecentDocumentName = querySnapshot.docs[0].id.toString();
      const documentRef = doc(cropMapCollection, mostRecentDocumentName);
      try {
        const documentSnapshot = await getDoc(documentRef);
        if (documentSnapshot.exists()) {
          const countyHarvestsCollectionRef = collection(documentRef, 'CountyHarvests');
          const countyDataPromises = [];
          for (const county of selectedCounties) { // Fetch data for selectedCounties
            const countyDocumentRef = doc(countyHarvestsCollectionRef, county);
            countyDataPromises.push(getDoc(countyDocumentRef));
          }
          const countyDataSnapshots = await Promise.all(countyDataPromises);
          const countyDataFromDocument = {};
          countyDataSnapshots.forEach((snapshot, index) => {
            if (snapshot.exists()) {
              const { harvestPercent, emergencePercent, plantedPercent } = snapshot.data();
              const county = selectedCounties[index];
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
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        try {
          const userDocRef = doc(db, 'myUsers', authUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const selectedCounties = userData.selectedCounties || [];
            setUserSelectedCounties(selectedCounties);
            fetchDoc();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Other methods and JSX...




  const updateHarvest = async (county) => {
    const cropMapCollection = collection(db, (`${selectedCrop}Map`).toString());

    const querySnapshot = await getDocs(query(cropMapCollection, orderBy("date", "desc"), limit(1)));
    const mostRecentName = querySnapshot.docs[0].id.toString();

    const documentRef = doc(cropMapCollection, mostRecentName);
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


  const handleUpdateClick = async () => { //literally the title
    for (const county of countiesList){ 
      setIsUpdating(true);
      await updateHarvest(county);
      setIsUpdating(false);
    }
  };
  
  const handleInputChange = (event, county) => { //takes in user input, i put some limits too
    const { name, value } = event.target;
    let newValue = Number(value);
  
    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 100) {
      newValue = 100;
    }

    setCountyData((prevData) => ({
      ...prevData,
      [county]: {
        ...prevData[county],
        [name]: newValue,
      },
    }));
  };


  return (
    <div>
      <Header> </Header>
      {user ? ( // If the user gets authent
        <>
      <select
        name="counties"
        id="selectedCounty"
        value={selectedCounty}
        onChange={(e) => setSelectedCounty(e.target.value)}
      >
        <option value="">Select a county</option>
        {countiesList.map((county, index) => (
          <option key={index} value={county}>
            {county}
          </option>
        ))}
      </select>
      <div>
      {selectedCounty && (
         <div className="the Input Bar!">
         <label>Harvest Percent:</label>
         <input
            type="number"
            name="selectedPercentType"
            value={Math.ceil(countyData[selectedCounty]?.harvestPercent || 0)} // Round up cause like if 79 it's 80 and everythign else is the same
            min="0"
            max="100"
            onChange={(event) => handleInputChange(event, selectedCounty)}
          />
         <span className="the text in the input bar">
           Current Percent: {countyData[selectedCounty]?.harvestPercent|| 0}%
         </span>
         </div>
        )}
      <button onClick={() => handleUpdateClick()} disabled={isUpdating}>
        {isUpdating ? 'Updating...' : 'Update Harvest Percent'}
      </button>
      </div>
        </>
      ) : (
        // If the user is not authenticated, show sign-up and log-in components
        <>
          <SignUp />
          <LogIn />
        </>
      )}
    </div>
  );
};

export default Updater;