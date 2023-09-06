
//BSD
//OK LET'S MAKE THIS SECURE

import React, { useState, useEffect } from 'react';
import { collection, query, limit, orderBy, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { countiesListDE, countiesListMD, countiesListPA, countiesListVA, countiesListWV } from './countiesList.js';
import Header from '../components/Header.js';
import {LogIn} from '../Auth/LogInComponent.js';
import {SignUp} from '../Auth/SignUpComponent.js';
import { useUpdater } from '../../userContext.js';

const stateUrlMap = {
  "DE": "/theRealStateOfDE.json",
  "MD": "/theRealStateOfMD.json",
  "WV": "/theRealStateOfWV.json",
  "VA": "/theRealStateOfVA.json",
  "PA": "/theRealStateOfPA.json"
};

const countiesByState = {
  "DE": countiesListDE,
  "MD": countiesListMD,
  "WV": countiesListWV,
  "VA": countiesListVA,
  "PA": countiesListPA
};

const Updater = () => {
    const router = useRouter();
    const { verified, admin, cropType, percentType, setAdmin, selectedCounty, setSelectedCounty, selectedState, setSelectedState } = useUpdater();
    console.log("Admin: ", admin);
    const [countyData, setCountyData] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [userSelectedCounties, setUserSelectedCounties] = useState([]);
    

    const selectedPercentType = percentType || null;
    const selectedCrop = cropType || null;

    const countiesList = userSelectedCounties || [];
    let url = stateUrlMap[selectedState] || '';

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            setAdmin(authUser)
            if (authUser) {
                try {
                    const userDocRef = doc(db, 'myUsers', authUser.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        const selectedCounties = userData.selectedCounties || [];
                        setUserSelectedCounties(selectedCounties);
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






  const updateHarvest = async (county) => {
    const collectionName = `${selectedCrop}Map`; // Dynamically set the collection name based on the selected crop
    const cropMapCollection = collection(db, collectionName);
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




  const handleUpdateClick = async () => {
    for (const county of countiesList) {
      setIsUpdating(true);
      await updateHarvest(county, selectedPercentType); // Pass selectedPercentType here
      setIsUpdating(false);
    }
  };
  
  const handleInputChange = (event, county, type) => {
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
        [type]: newValue, // Use selectedPercentType here
      },
    }));
  };
  


  return (
    <div>
      <Header> </Header>
      {verified ? (
                <>
                    {admin && (
                        <select
                            name="states"
                            id="selectedState"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            <option value="">Select a state</option>
                            {Object.keys(stateUrlMap).map((state, index) => (
                                <option key={index} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    )}
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
      {selectedCounty && (
         <div className="the planted Input Bar!">
         <label>planted Percent:</label>
         <input
            type="number"
            name="plantedPercent"
            value={Math.ceil(countyData[selectedCounty]?.plantedPercent || 0)} // Round to ceiling
            min="0"
            max="100"
            onChange={(event) => handleInputChange(event, selectedCounty, "plantedPercent")}
            // onKeyPress={(event) => handleKeyPress(event, selectedCounty)}
          />
         <span className="the text in the input bar">
           Current Percent: {countyData[selectedCounty]?.plantedPercent || 0}%
         </span>
       </div>
      )}
      {selectedCounty && (
         <div className="the Input Bar!">
         <label>emergencePercent:</label>
         <input
            type="number"
            name="emergencePercent"
            value={Math.ceil(countyData[selectedCounty]?.emergencePercent || 0)} // Round to ceiling
            min="0"
            max="100"
            onChange={(event) => handleInputChange(event, selectedCounty, "emergencePercent")}
            // onKeyPress={(event) => handleKeyPress(event, selectedCounty)}
          />
         <span className="the text in the input bar">
           Current Percent: {countyData[selectedCounty]?.emergencePercent || 0}%
         </span>
       </div>
      )}
      {selectedCounty && (
         <div className="the Input Bar!">
         <label>Harvest Percent:</label>
         <input
            type="number"
            name="harvestPercent"
            value={Math.ceil(countyData[selectedCounty]?.harvestPercent || 0)} // Round to ceiling
            min="0"
            max="100"
            onChange={(event) => handleInputChange(event, selectedCounty, "harvestPercent")}
            // onKeyPress={(event) => handleKeyPress(event, selectedCounty)}
          />
         <span className="the text in the input bar">
           Current Percent: {countyData[selectedCounty]?.harvestPercent || 0}%
         </span>
       </div>
      )}
      <button onClick={() => handleUpdateClick()} disabled={isUpdating}>
        {isUpdating ? 'Updating...' : 'Update Harvest Percent'}
      </button>
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

export {Updater};