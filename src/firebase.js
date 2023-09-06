import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig'; 

let app;

if (!getApps().length) { // Use getApps() to check if any apps have been initialized
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // if already initialized, use the first one
}

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
