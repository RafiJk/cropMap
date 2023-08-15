
// //BSD
// import React, { useState, useEffect } from "react";
// import { getDoc } from 'firebase/firestore';
// import { getFirestore, collection, updateDoc, setDoc, doc, onSnapshot, Timestamp, query, orderBy, limit,  getDocs} from "firebase/firestore";
// import { initializeApp } from "firebase/app";
// import { useRouter } from 'next/router';
// import Header from './components/Header';
// import styles from './addMapDate.module.css';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField'; 
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";
// import { scaleQuantize } from "d3-scale";
// import { Container } from "@mui/material";
// import { countiesListDE, countiesListMD, countiesListPA, countiesListVA, countiesListWV } from "./countiesList";


// const firebaseConfig = {
//   apiKey: "AIzaSyD-LpxW3J2ztr1Q1cE_x8pPHv7JRNa4M9g",
//   authDomain: "ag-map-d4af3.firebaseapp.com",
//   projectId: "ag-map-d4af3",
//   storageBucket: "ag-map-d4af3.appspot.com",
//   messagingSenderId: "574258608297",
//   appId: "1:574258608297:web:4dc19cc58b6aff298dd1b8"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const CornMapCollection = collection(db, "CornMap");

// const stateUrlMap = {"DE": "/theRealStateOfDE.json", "MD": "/theRealStateOfMD.json",
//  "WV": "/theRealStateOfWV.json", "VA": "/theRealStateOfVA.json", "PA": "/theRealStateOfPA.json" };

// const countiesByState = {"DE": countiesListDE, "MD": countiesListMD, "WV": countiesListWV,
//   "VA": countiesListVA, "PA": countiesListPA
// };

// // const percentTypeOptions = [
// //   { label: 'Harvest Percent', value: 'harvestPercent' },
// //   { label: 'Emergence Percent', value: 'emergencePercent' },
// //   { label: 'Planted Percent', value: 'plantedPercent' },
// // ];

// const mostRecentDocument = async (smq) => {
//   try { //the dates aren't valid...eitehr of them
//     const querySnapshot = await getDocs(smq);
//     const snapshot = querySnapshot.docs[0];
//     if (snapshot) {
//       let currentDate = Date.now();
//       currentDate = Math.floor(currentDate)/1000;
//       console.log(currentDate);
//       // console.log(currentDate);
//       let snapshotDate = await (snapshot.data().date);
//       snapshotDate = snapshotDate.seconds;
//       console.log(snapshotDate);
//       const diffInDays = (currentDate - snapshotDate);
//       console.log(diffInDays); //why do i keep getting 43000
//        if(!snapshotDate){
//         console.error("Error retrieving the most recent document:", error);
//        }
//       // const diffInDays = 0;
//       if ( diffInDays >= 604800){ //rn this is testing if it's less then 7 day
//         console.log('what');
//         return true;
//       }else{
//         return false;
//       }
//     } else {
//       console.log('hey');
//       return false;
//     }
//   } catch (error) {
//     console.error("Error retrieving the most recent document:", error);
//     return false;
//   }
// };


// const NewDocMaker = () => {
//   const newMapDocRef = doc(collection(db, "CornMap"));
//   setDoc(newMapDocRef, { date: Timestamp.now() }).then(async () => {
//     const countyHarvestsCollectionRef = collection(newMapDocRef, 'CountyHarvests');
    
//     for (const state in countiesByState) {
//       const stateCounties = countiesByState[state];
      
//       for (const county of stateCounties) {
//         const newHarvestDocRef = doc(countyHarvestsCollectionRef, county);
//         setDoc(newHarvestDocRef, {
//           state: state,
//           county: county,
//           plantedPercent: 0,
//           emergencePercent: 0,
//           harvestPercent: 0,
//         });
//       }
//     }
//   });
//   return true;
// };


// const AddHarvest = () => {

//   const router = useRouter();

//   const selectedState = router.query.state || null;
//   const selectedCrop = router.query.crop || null;
//   const selectedPercentType = router.query.percentType || null;

//   console.log(selectedPercentType);
//   console.log(selectedCrop);
//   console.log(selectedState);

//   const { name } = router.query;

//   // const selectedStateCountyList = `countyList${selectedState}`;


//   const countiesList = countiesByState[selectedState] || countiesListMD;


//   let url = stateUrlMap[selectedState] || "";


//   const [loading, setLoading] = useState(true);
//   const steptwo = false;
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [countyData, setCountyData] = useState({});
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [selectedPercentOption, setSelectedPercentOption] = useState(null);
//   const [selectedCounty, setSelectedCounty] = useState(null);

//    // Count how many options have a selectedPercentType of 0
//    const zeroPercentCount = countiesList.reduce((count, county) => {
//     if (countyData[county]?.[selectedPercentType] === 0) {
//       return count + 1;
//     }
//     return count;
//   }, 0);

//   // Sort countiesList based on the selectedPercentType value
//   const sortedCountiesList = countiesList.slice().sort((a, b) => {
//     return (countyData[a]?.[selectedPercentType] || 0) - (countyData[b]?.[selectedPercentType] || 0);
//   });

//   const colorScale = scaleQuantize()
//     .domain([0, 100]) // Adjust the domain based on your data range
//        .range([
//           "#c0c0c0",
//           "#ffedea",
//           "#ffcec5",
//           "#ffad9f",
//           "#ff8a75",
//           "#ff5533",
//           "#e2492d",
//           "#be3d26",
//           "#9a311f",
//           "#782618"
//         ]);
//   // Update the fill color of the counties based on the selectedPercentType
//   const handleMapFill = (county) => {
//     if (county && countyData[county] && selectedPercentType) {
//       return colorScale(countyData[county][selectedPercentType]);
//     }
//     return "#EEE"; // Default color if data is not available
//   };
//   const handleCountyClick = (county) => {
//     setSelectedCounty(county === selectedCounty ? null : county);
//   };

// useEffect (()=>{
//   const fetchData = async () => {
//     const CornMapQuery = query(CornMapCollection, orderBy("date", "desc"), limit(1));
//     const stepone = await mostRecentDocument(CornMapQuery);
//     let steptwo = false;
//     if (stepone === true) {
//       steptwo = NewDocMaker();
//     } else {
//       steptwo = false;
//     }
//     // setSteptwo(steptwo);
//     setLoading(false);
//   };

//   const fetchCountyData = async () => {
//     let mostRecentName = await getDocumentName();
    
//     if (steptwo === true) {
//       // If a new document was created, fetch the newly created document instead
//       const cmq = query(CornMapCollection, where("id", "==", mostRecentName));



//       const querySnapshot = await getDocs(cmq);
//       if (!querySnapshot.empty) {
//         const recentDocument = querySnapshot.docs[0];
//         mostRecentName = recentDocument.id.toString();
//       }
    
//     const documentRef = doc(CornMapCollection, mostRecentName);
    
//     try {
//       const documentSnapshot = await getDoc(documentRef);

//       if (documentSnapshot.exists()) {
//         const countyHarvestsCollectionRef = collection(documentRef, 'CountyHarvests');
//         const countyDataPromises = [];

//         for (const county of countiesList) {
//           const countyDocumentRef = doc(countyHarvestsCollectionRef, county);
//           countyDataPromises.push(getDoc(countyDocumentRef));
//         }

//         const countyDataSnapshots = await Promise.all(countyDataPromises);
//         const countyDataFromDocument = {};

//         countyDataSnapshots.forEach((snapshot, index) => {
//           if (snapshot.exists()) {
//             const { harvestPercent, emergencePercent, plantedPercent } = snapshot.data();
//             const county = countiesList[index];

//             countyDataFromDocument[county] = {
//               harvestPercent,
//               emergencePercent,
//               plantedPercent,
//             };
//           }
//         });

//         setCountyData(countyDataFromDocument);
//       }
//     } catch (error) {
//       console.error('Error fetching county data:', error);
//     }
//   }else{
    

//   }
//   };

//   fetchData();
//   fetchCountyData();
// }, []);

  
//   const getDocumentName = async () => {
//     try {
//       const cmq = query(CornMapCollection, orderBy("date", "desc"), limit(1)); 
//       const querySnapshot = await getDocs(cmq);
//       if (!querySnapshot.empty) {
//         const recentDocument = querySnapshot.docs[0];
//         console.log(recentDocument.id.toString());
//         return recentDocument.id.toString();
//       } else {
//         console.log('No documents found in CornMap collection.');
//       }
//     } catch (error) {
//       console.error('Error fetching documents:', error);
//     }
//   };

//   const updateHarvest = async (county) => {
//     const mostRecentName = await getDocumentName();
//     const documentRef = doc(CornMapCollection, mostRecentName);
//     const countyDocumentRef = doc(collection(documentRef, 'CountyHarvests'), county);

//     try {
//       const countyDocumentSnapshot = await getDoc(countyDocumentRef);

//       if (countyDocumentSnapshot.exists()) {
//         await updateDoc(countyDocumentRef, countyData[county]);
//         console.log('Harvest percent updated successfully.');
//       } else {
//         console.log('County document does not exist.');
//       }
//     } catch (error) {
//       console.error('Error updating harvest percent:', error);
//     }
//   };


//   const handleUpdateClick = async () => {
//     for (const county of countiesList){ 
//       setIsUpdating(true);
//       await updateHarvest(county);
//       setIsUpdating(false);
//     }
//   };

//   const handleInputChange = (event, county) => {
//     const { name, value } = event.target;
//     setCountyData((prevData) => ({
//       ...prevData,
//       [county]: {
//         ...prevData[county],
//         [name]: Number(value),
//       },
//     }));
//   };

//   const handleOptionChange = (_, value) => {
//     setSelectedOption(value);
//   };

//   const handlePercentTypeChange = (_, value) => {
//     setSelectedPercentOption(value);
//   };


//   if (loading) {
//     return <p>Loading...</p>;
//   }
//   return (
//     <div>
//       <Header/>
//       <Container maxWidth="sm">
//         <Autocomplete
//           id="options-autocomplete"
//           options={sortedCountiesList}
//           style={{ width: 300 }}
//           value={selectedOption}
//           onChange={handleOptionChange}
//           renderInput={(params) => <TextField {...params} label="Choose an option" />}
//         />
//         {selectedOption && selectedPercentType && ((
//           <div key={selectedOption}>
//             <h2>{selectedOption}</h2>
//             <form>
//               <div className={styles.inputContainer}>
//                 <label>{selectedPercentType}:</label>
//                 <input
//                   type="number"
//                   name={selectedPercentType}
//                   value={countyData[selectedOption]?.[selectedPercentType] || 0}
//                   onChange={(event) => handleInputChange(event, selectedOption)}
//                 />
//                 <span className={styles.currentPercent}>
//                   Current Percent: {countyData[selectedOption]?.[selectedPercentType] || 0}%
//                 </span>
//               </div>
//             </form>
//           </div>
//         ))}
//       </Container>
//       <div>
//         Number of options with {selectedPercentType} of 0: {zeroPercentCount}
//       </div>
//       <button onClick={() => handleUpdateClick()} disabled={isUpdating}>
//         {isUpdating ? 'Updating...' : 'Update ' + selectedPercentType.toString()}
//       </button>
//       <button type="Return To Home" onClick={() => router.push("/")}>
//         Return To Home
//       </button>
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem" }}>
//         <div style={{ flex: "0 0 70%", marginRight: "1rem" }}>
//         <ComposableMap projection="geoAlbersUsa" style={{ height: "calc(100vh - 0px)" }}>
//               <Geographies geography={url}>
//                 {({ geographies }) =>
//                   geographies.map((geo) => {
//                     const county = geo.properties.NAME;
//                     const isHighlighted = countyData[county] === selectedCounty;
//                     return (
//                       <Geography
//                         key={geo.rsmKey}
//                         geography={geo}
//                         fill={handleMapFill(county)} // Use the handleMapFill function for color
//                         onMouseEnter={() => handleCountyClick(countyData[county])}
//                         onMouseLeave={() => handleCountyClick(null)}
//                         style={{
//                           default: {
//                             outline: "none"
//                           },
//                           hover: {
//                             outline: "none"
//                           },
//                           pressed: {
//                             outline: "none"
//                           },
//                           highlight: {
//                             fill: "#F53",
//                             outline: "none"
//                           }
//                         }}
//                       />
//                     );
//                   })
//                 }
//               </Geographies>
//             </ComposableMap>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default AddHarvest;