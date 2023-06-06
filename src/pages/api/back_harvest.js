// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

// Initialize Firebase

export default (req, res) => {
  console.log("back");
  if (req.method === 'GET') {
    const data = [];
    fs.createReadStream('/Users/rjkigner/projects/pest-map/public/harvest.csv')
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => res.status(200).json(data));
  } else if (req.method === 'POST') {
    const data = req.body;
    const csvWriter = createObjectCsvWriter({
      path: '/Users/rjkigner/projects/pest-map/public/harvest.csv',
      header: [
        { id: 'id', title: 'id' },
        { id: 'name', title: 'name' },
        { id: 'year', title: 'year' },
        { id: 'harvest_percent', title: 'harvest_percent' },
      ],
    });

    csvWriter
      .writeRecords(data)
      .then(() => res.status(200).end())
      .catch((error) => res.status(500).json({ error: error.message }));
  } else {
    // If the request method is not GET or POST, respond with 405 Method Not Allowed
    res.status(405).end();
  }
};


// import fs from 'fs';
// import csv from 'csv-parser';
// // import createCsvWriter from 'csv-writer';
// import { createObjectCsvWriter } from 'csv-writer';
// // import { createObjectCsvWriter } from 'csv-writer';

// export default (req, res) => {
//   if (req.method === 'GET') {
//     const data = [];
//     fs.createReadStream('/Users/rjkigner/projects/pest-map/public/harvest.csv')
//       .pipe(csv())
//       .on('data', (row) => data.push(row))
//       .on('end', () => res.status(200).json(data));
//   } else if (req.method === 'POST') {
//     const data = req.body;
//     const csvWriter = createObjectCsvWriter({
//       path: '/Users/rjkigner/projects/pest-map/public/harvest.csv',
//       header: [
//         { id: 'id', title: 'id' },
//         { id: 'name', title: 'name' },
//         { id: 'year', title: 'year' },
//         { id: 'harvest_percent', title: 'harvest_percent' },
//       ],
//     });;

//     csvWriter
//       .writeRecords(data)
//       .then(() => res.status(200).end())
//       .catch((error) => res.status(500).json({ error: error.message }));
//   } else {
//     // If the request method is not GET or POST, respond with 405 Method Not Allowed
//     res.status(405).end();
//   }
// };

