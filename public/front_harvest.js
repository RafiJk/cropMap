// import { initializeApp } from "firebase/app";
// import { getFirestore, doc, getDoc, collection, setDoc, addDoc, Timestamp } from "firebase/firestore";
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';

// const fs = require('fs');
// const Papa = require('papaparse');

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

// const docRef = doc(db, "Map/T3i0k3NiZ0aUdVua6VG8/CountyHarvests", "MNArB7S2BcoQ19pzLM3F");
// const docSnap = await getDoc(docRef);

// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
// } else {
//   console.log("No such document!");
// }

// fs.readFile('./public/harvest.csv', 'utf8', function (err, data) {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   const results = Papa.parse(data, { header: true }).data;

//   const mapTypes = ['CornMap', 'WheatMap', 'SoyMap'];
//   mapTypes.forEach(mapType => {
//     const newMapDocRef = doc(collection(db, mapType));
//     setDoc(newMapDocRef, { date: Timestamp.now() })
//       .then(() => {
//         const countyHarvestsCollectionRef = collection(newMapDocRef, 'CountyHarvests');

//         // Add all counties as documents in the CountyHarvests collection of the new Map document
//         results.forEach(function (row) {
//           if (!row.name) return; // Ignore row if name (i.e., county) is missing

//           addDoc(countyHarvestsCollectionRef, {
//             county: row.name,
//             harvestPercent: parseFloat(row.harvest_percent),
//             plantedPercent: 1,
//             emergencePercent: 1
//           }).catch((error) => console.error("Error adding county: ", error));
//         });
//       })
//       .catch((error) => console.error("Error creating Map document: ", error));
//   });
// });

// function HarvestPage() {
//   return (
//     <div>
//       {/* <button onClick={handleSave}>Click ME</button> */}
//     </div>
//   );
// }

// export default HarvestPage;

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// //THIS IS SUPPOSED OT GLITCH OUT

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { doc, getDoc } from "firebase/firestore";
// import { collection, setDoc, addDoc, Timestamp } from "firebase/firestore";
// // import Papa from 'papaparse';
// // import fs from 'fs';

// const fs = require('fs');
// const Papa = require('papaparse');


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

// const docRef = doc(db, "Map/T3i0k3NiZ0aUdVua6VG8/CountyHarvests", "MNArB7S2BcoQ19pzLM3F");
// const docSnap = await getDoc(docRef);

// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
// } else {
//   // docSnap.data() will be undefined in this case
//   console.log("No such document!");
// }


// fs.readFile('./public/harvest.csv', 'utf8', function (err, data) {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   const results = Papa.parse(data, { header: true }).data;

//   const newMapDocRef = doc(collection(db, 'Map'));
//   setDoc(newMapDocRef, { date: Timestamp.now() })
//     .then(() => {
//       const countyHarvestsCollectionRef = collection(newMapDocRef, 'CountyHarvests');

//       // Add all counties as documents in the CountyHarvests collection of the new Map document
//       results.forEach(function (row) {
//         if (!row.name) return; // Ignore row if name (i.e., county) is missing

//         addDoc(countyHarvestsCollectionRef, {
//           county: row.name,
//           harvestPercent:  parseFloat(row.harvest_percent) ,
//           plantedPercent: 1,
//           emergencePercent: 1
//         }).catch((error) => console.error("Error adding county: ", error));
//       });
//     })
//     .catch((error) => console.error("Error creating Map document: ", error));
// });

// function HarvestPage() {
//   <div>
//      {/* <button onClick={handleSave}>Click ME</button> */}
//   </div>
    


  
// } export default HarvestPage;


// // const docRef = doc(db, "Map/bwkoONRvwYLUx2Npst1W/CountyHarvests", "8jk2Hwbe4NAld0xL2BYW");