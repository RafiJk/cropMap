
import React, { useState } from "react";
import { getFirestore, collection, addDoc, setDoc, doc, Timestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './addMapDate.module.css'; // Assuming that you have an AddMapDate.module.css file with your styles.

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
  'Allegany', 'Anne Arundel', 'Baltimore', 'Calvert', 'Caroline',
  'Carroll', 'Cecil', 'Charles', 'Dorchester', 'Frederick', 'Garrett',
  'Harford', 'Howard', 'Kent', 'Montgomery', 'Prince George\'s',
  'Queen Anne\'s', 'St. Mary\'s', 'Somerset', 'Talbot', 'Washington',
  'Wicomico', 'Worcester', 'Baltimore City',
];

const AddMapDate = () => {
  const [crop, setCrop] = useState('corn');
  const [cropData, setCropData] = useState({
    corn: Array(24).fill({ harvestPercent: 1, emergencePercent: 1, plantedPercent: 1 }),
    wheat: Array(24).fill({ harvestPercent: 1, emergencePercent: 1, plantedPercent: 1 }),
    soy: Array(24).fill({ harvestPercent: 1, emergencePercent: 1, plantedPercent: 1 })
  });
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const router = useRouter();

  const handlePercentChange = (event, index, field) => {
    const updatedCropData = { ...cropData };
    updatedCropData[crop][index] = { ...updatedCropData[crop][index], [field]: parseFloat(event.target.value) };
    setCropData(updatedCropData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const db = getFirestore();
    const cropMap = crop.charAt(0).toUpperCase() + crop.slice(1) + 'Map';
    const newMapDocRef = doc(collection(db, cropMap));
    await setDoc(newMapDocRef, { date: Timestamp.now() });

    const countyHarvestsCollectionRef = collection(newMapDocRef, 'CountyHarvests');

    countiesList.forEach(async (county, index) => {
      await addDoc(countyHarvestsCollectionRef, {
        county: county,
        harvestPercent: cropData[crop][index].harvestPercent,
        emergencePercent: cropData[crop][index].emergencePercent,
        plantedPercent: cropData[crop][index].plantedPercent,
      });
    });

    alert('New date with CountyHarvests added!');
    router.push('/');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (password === '613') {
      setShowModal(false);
    } else {
      setAttempts(attempts + 1);
      if (attempts >= 4) {
        router.push('/');
      }
    }
  };

  return (
    <div>
      {showModal ? (
        <div className={styles.modal}>
          <form onSubmit={handlePasswordSubmit}>
            <h2>Enter Password</h2>
            <input type="password" value={password} onChange={handlePasswordChange} />
            <button type="submit">Submit</button>
            <Link href="/"><button>Go Back</button></Link>
          </form>
        </div>
      ) : (
        <>
          <Link href="/"><button>Home</button></Link>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label>Crop Type:</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)}>
              <option value="corn">Corn</option>
              <option value="wheat">Wheat</option>
              <option value="soy">Soy</option>
            </select>
            {countiesList.map((county, index) => (
              <div key={index} className={styles.inputGroup}>
                <label>{county}</label>
                <input
                  type="number"
                  placeholder="Harvest Percent"
                  value={cropData[crop][index].harvestPercent}
                  onChange={(event) => handlePercentChange(event, index, 'harvestPercent')}
                />
                <input
                  type="number"
                  placeholder="Emergence Percent"
                  value={cropData[crop][index].emergencePercent}
                  onChange={(event) => handlePercentChange(event, index, 'emergencePercent')}
                />
                <input
                  type="number"
                  placeholder="Planted Percent"
                  value={cropData[crop][index].plantedPercent}
                  onChange={(event) => handlePercentChange(event, index, 'plantedPercent')}
                />
              </div>
            ))}
            <button type="submit">Add New Date</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddMapDate;


// import React, { useState, useEffect } from "react";
// // import { getFirestore, collection, addDoc, setDoc, doc, Timestamp } from "firebase/firestore";
// import { initializeApp } from "firebase/app";
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import styles from './addMapDate.module.css'; // Assuming that you have an AddMapDate.module.css file with your styles.
// import { getFirestore, collection, addDoc, setDoc, doc, Timestamp, query, orderBy, limit, getDocs, getDoc, updateDoc } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyD-LpxW3J2ztr1Q1cE_x8pPHv7JRNa4M9g",
//   authDomain: "ag-map-d4af3.firebaseapp.com",
//   projectId: "ag-map-d4af3",
//   storageBucket: "ag-map-d4af3.appspot.com",
//   messagingSenderId: "574258608297",
//   appId: "1:574258608297:web:4dc19cc58b6aff298dd1b8"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const countiesList = [
//   'Allegany', 'Anne Arundel', 'Baltimore', 'Calvert', 'Caroline',
//   'Carroll', 'Cecil', 'Charles', 'Dorchester', 'Frederick', 'Garrett',
//   'Harford', 'Howard', 'Kent', 'Montgomery', 'Prince George\'s',
//   'Queen Anne\'s', 'St. Mary\'s', 'Somerset', 'Talbot', 'Washington',
//   'Wicomico', 'Worcester', 'Baltimore City',
// ];

// const AddMapDate = () => {
//   const [crop, setCrop] = useState('corn');
//   const [cropData, setCropData] = useState({
//     corn: Array(24).fill({ harvestPercent: 1, emergencePercent: 1, plantedPercent: 1 }),
//     wheat: Array(24).fill({ harvestPercent: 1, emergencePercent: 1, plantedPercent: 1 }),
//     soy: Array(24).fill({ harvestPercent: 1, emergencePercent: 1, plantedPercent: 1 })
//   });
//   const [password, setPassword] = useState('');
//   const [attempts, setAttempts] = useState(0);
//   const [showModal, setShowModal] = useState(true);
//   const router = useRouter();


//   useEffect(() => {
//     const fetchLatestData = async () => {
//       const cropTypes = ['CornMap', 'WheatMap', 'SoyMap'];
//       const newCropData = { ...cropData };

//       for (const cropType of cropTypes) {
//         const q = query(collection(db, cropType), orderBy('date', 'desc'), limit(1));
//         const querySnapshot = await getDocs(q);
//         const latestDoc = querySnapshot.docs[0];
//         if (latestDoc) {
//           const latestData = latestDoc.data();
//           // if ((Timestamp.now().seconds - latestData.date.seconds) < 7 * 24 * 60 * 60) { // If less than a week
//           if ((Timestamp.now().seconds - latestData.date.seconds) < .5 * 24 * 60 * 60) { // If less than a day
//           const countiesRef = collection(latestDoc.ref, 'CountyHarvests');
//             const countySnapshot = await getDocs(countiesRef);
//             const lowerCropType = cropType.toLowerCase().slice(0, -3); // to match your state's crop names
//             countySnapshot.docs.forEach((doc, index) => {
//               const countyData = doc.data();
//               newCropData[lowerCropType][index] = {
//                 harvestPercent: countyData.harvestPercent,
//                 emergencePercent: countyData.emergencePercent,
//                 plantedPercent: countyData.plantedPercent,
//               };
//             });
//           }
//         }
//       }
//       setCropData(newCropData);
//     };

//     fetchLatestData();
//   }, []);



//   const handlePercentChange = (event, index, field) => {
//     const updatedCropData = { ...cropData };
//     updatedCropData[crop][index] = { ...updatedCropData[crop][index], [field]: parseFloat(event.target.value) };
//     setCropData(updatedCropData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
  
//     const cropTypes = ['corn', 'wheat', 'soy'];
  
//     for (const cropType of cropTypes) {
//       const collectionName = cropType.charAt(0).toUpperCase() + cropType.slice(1) + 'Map';
//       const collectionRef = collection(db, collectionName);
  
//       let docRef;
  
//       // Check if there's already an existing document in the past week
//       const q = query(collectionRef, orderBy('date', 'desc'), limit(1));
//       const querySnapshot = await getDocs(q);
  
//       if (!querySnapshot.empty) {
//         const latestDoc = querySnapshot.docs[0];
//         const latestData = latestDoc.data();
//         if ((Timestamp.now().seconds - latestData.date.seconds) < 7 * 24 * 60 * 60) { // If less than a week
//           docRef = latestDoc.ref;
//         }
//       }
  
//       // If there's no existing document or it's older than a week, create a new one
//       if (!docRef) {
//         docRef = doc(collectionRef);
//         await setDoc(docRef, { date: Timestamp.now() });
//       }
  
//       const countyHarvestsCollectionRef = collection(docRef, 'CountyHarvests');
  
//       countiesList.forEach(async (county, index) => {
//         const docSnapshot = await getDoc(doc(countyHarvestsCollectionRef, county));
//         const countyData = {
//           county: county,
//           harvestPercent: cropData[cropType][index].harvestPercent,
//           emergencePercent: cropData[cropType][index].emergencePercent,
//           plantedPercent: cropData[cropType][index].plantedPercent,
//         };
        
//         if (docSnapshot.exists()) {
//           await updateDoc(docSnapshot.ref, countyData);
//         } else {
//           await addDoc(countyHarvestsCollectionRef, countyData);
//         }
//       });
//     }
  
//     alert('New date with CountyHarvests added!');
//     router.push('/');
//   };
  
  
//   const handlePasswordChange = (event) => {
//     setPassword(event.target.value);
//   };

//   const handlePasswordSubmit = (event) => {
//     event.preventDefault();
//     if (password === '613') {
//       setShowModal(false);
//     } else {
//       setAttempts(attempts + 1);
//       if (attempts >= 4) {
//         router.push('/');
//       }
//     }
//   };

//   return (
//     <div>
//       {showModal ? (
//         <div className={styles.modal}>
//           <form onSubmit={handlePasswordSubmit}>
//             <h2>Enter Password</h2>
//             <input type="password" value={password} onChange={handlePasswordChange} />
//             <button type="submit">Submit</button>
//             <Link href="/"><button>Go Back</button></Link>
//           </form>
//         </div>
//       ) : (
//         <>
//           <Link href="/"><button>Home</button></Link>
//           <form onSubmit={handleSubmit} className={styles.form}>
//             <label>Crop Type:</label>
//             <select value={crop} onChange={(e) => setCrop(e.target.value)}>
//               <option value="corn">Corn</option>
//               <option value="wheat">Wheat</option>
//               <option value="soy">Soy</option>
//             </select>
//             {countiesList.map((county, index) => (
//               <div key={index} className={styles.inputGroup}>
//                 <label>{county}</label>
//                 <input
//                   type="number"
//                   placeholder="Harvest Percent"
//                   value={cropData[crop][index].harvestPercent}
//                   onChange={(event) => handlePercentChange(event, index, 'harvestPercent')}
//                 />
//                 <input
//                   type="number"
//                   placeholder="Emergence Percent"
//                   value={cropData[crop][index].emergencePercent}
//                   onChange={(event) => handlePercentChange(event, index, 'emergencePercent')}
//                 />
//                 <input
//                   type="number"
//                   placeholder="Planted Percent"
//                   value={cropData[crop][index].plantedPercent}
//                   onChange={(event) => handlePercentChange(event, index, 'plantedPercent')}
//                 />
//               </div>
//             ))}
//             <button type="submit">Add New Date</button>
//           </form>
//         </>
//       )}
//     </div>
//   );
// };

// export default AddMapDate;

//IT SENT ALL THREE TO SOY...OK WE WORK ON BACKEND FOR NEXT WHILE...it only updates one...
