import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let db: Firestore;

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

if (!getApps().length) {
  if (serviceAccount) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // This will use Application Default Credentials
    // in a deployed environment like Cloud Run.
    adminApp = initializeApp();
  }
} else {
  adminApp = getApps()[0];
}

db = getFirestore(adminApp);

export const getAdminDB = () => db;
