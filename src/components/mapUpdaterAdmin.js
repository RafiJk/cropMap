//BSD
import React, { useState, useEffect } from 'react';
import { collection, query, limit, orderBy, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { countiesListDE, countiesListMD, countiesListPA, countiesListVA, countiesListWV } from './countiesList.js';
import Header from './misc/Header.js';
import { LogIn } from './Auth/LogInComponent.js';
import { SignUp } from './Auth/SignUpComponent.js';
import { useUpdater } from '../userContext.js';
import { Paper, FormControl, InputLabel, Select, MenuItem, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material';
import { db } from '../firebase.js';


const StyledPaper = styled(Paper)({
  padding: '2rem',
  margin: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

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
    const { verified, admin, percentType, cropType, setCropType, setAdmin, contextSelectedCounties, setSelectedCounty, selectedState, setSelectedState } = useUpdater();
    console.log("Admin: ", admin);
    console.log(cropType.slug);
    console.log(percentType.slug);
    const [countyData, setCountyData] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    // const [userSelectedCounties, setUserSelectedCounties] = useState([]);
    

    const selectedPercentType = percentType.slug || null;
    const selectedCrop = cropType.slug || null;

    const countiesList = countiesByState;
    let url = stateUrlMap[selectedState] || '';

    const [editableCounties, setEditableCounties] = useState([]);

    // State variable to hold the currently chosen county for editing
    const [currentCounty, setCurrentCounty] = useState('');

    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
          setAdmin(authUser)
          if (authUser) {
              try {
                  
                  const userDocRef = doc(db, 'myUsers', authUser.uid);
                  const userDocSnapshot = await getDoc(userDocRef);
                  if (userDocSnapshot.exists()) {
                    const userState = userData.state; // assuming userData has a 'state' property which stores the state abbreviation
                    const userCounties = countiesByState[selectedState] || [];
                    setEditableCounties(userCounties);
                  }
              } catch (error) {
                  console.error('Error fetching user data:', error);
              }
          }
      });
      return () => {
          unsubscribe();
      };
  ``}, []);


  const updateHarvest = async (county) => {
    let sC = selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1);
    const collectionName = `${sC}Map`; // Dynamically set the collection name based on the selected crop
    
    console.log(collectionName);
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
    // Loop through the keys of countyData (the counties the user has updated)
    for (const county of Object.keys(countyData)) {
      console.log(county);
      setIsUpdating(true);
      await updateHarvest(county);  // Just send the county name
      setIsUpdating(false);
    }
    // router.push('/');
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
  

  useEffect(() => {
    if (currentCounty) {
      fetchCountyData(currentCounty);
    }
  }, [currentCounty]);
  
  const fetchCountyData = async (county) => {
    let sC = selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1);
    const collectionName = `${sC}Map`; 
    const cropMapCollection = collection(db, collectionName);
    const querySnapshot = await getDocs(query(cropMapCollection, orderBy("date", "desc"), limit(1)));
    const mostRecentName = querySnapshot.docs[0].id.toString();
  
    const documentRef = doc(cropMapCollection, mostRecentName);
    const countyDocumentRef = doc(collection(documentRef, 'CountyHarvests'), county);
  
    try {
      const countyDocumentSnapshot = await getDoc(countyDocumentRef);
      if (countyDocumentSnapshot.exists()) {
        const data = countyDocumentSnapshot.data();
        setCountyData((prevData) => ({
          ...prevData,
          [county]: data
        }));
      } else {
        console.log('County document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching county data:', error);
    }
  };
  


  return (
    <div>
      <Header />
      <StyledPaper elevation={3}>
        {verified ? (
          <>
            {admin && (
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Select a state</InputLabel>
                <Select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {Object.keys(stateUrlMap).map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Select a county</InputLabel>
                <Select
                    value={currentCounty}
                    onChange={(e) => setCurrentCounty(e.target.value)}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {editableCounties.map((county)  => (
                        <MenuItem key={county} value={county}>
                            {county}
                        </MenuItem>
                    ))}
                  
                </Select>
            </FormControl>
      {currentCounty && (
         <div className="the planted Input Bar!">
         <label>planted Percent:</label>
         <input
            type="number"
            name="plantedPercent"
            value={Math.ceil(countyData[currentCounty]?.plantedPercent || 0)} // Round to ceiling
            min="0"
            max="100"
            onChange={(event) => handleInputChange(event, currentCounty, "plantedPercent")}
            // onKeyPress={(event) => handleKeyPress(event, selectedCounty)}
          />
         <span className="the text in the input bar">
           Current Percent: {countyData[currentCounty]?.plantedPercent || 0}%
         </span>
       </div>
      )}
      {currentCounty && (
         <div className="the Input Bar!">
         <label>emergencePercent:</label>
         <input
            type="number"
            name="emergencePercent"
            value={Math.ceil(countyData[currentCounty]?.emergencePercent || 0)} // Round to ceiling
            min="0"
            max="100"
            onChange={(event) => handleInputChange(event, currentCounty, "emergencePercent")}
            // onKeyPress={(event) => handleKeyPress(event, selectedCounty)}
          />
         <span className="the text in the input bar">
           Current Percent: {countyData[currentCounty]?.emergencePercent || 0}%
         </span>
       </div>
      )}
      {currentCounty && (
         <div className="the Input Bar!">
         <label>Harvest Percent:</label>
         <input
            type="number"
            name="harvestPercent"
            value={Math.ceil(countyData[currentCounty]?.harvestPercent || 0)} // Round to ceiling
            min="0"
            max="100"
            onChange={(event) => handleInputChange(event, currentCounty, "harvestPercent")}
            // onKeyPress={(event) => handleKeyPress(event, selectedCounty)}
          />
         <span className="the text in the input bar">
           Current Percent: {countyData[currentCounty]?.harvestPercent || 0}%
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
    </StyledPaper>
    </div>
  );
};

export {Updater};


