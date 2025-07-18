// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// import { getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyD03zV09ZmBh3uwHfr44Wdtd3JqDk3VdOQ",
  authDomain: "e-comheadphones.firebaseapp.com",
  projectId: "e-comheadphones",
  storageBucket: "e-comheadphones.firebasestorage.app",
  messagingSenderId: "123476085780",
  appId: "1:123476085780:web:4a0085c0f60a5609e82b01",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export default auth;

export const db = getFirestore(app);

export const storage = getStorage(app);
export const database = getDatabase(app);
// export const getDoc = getDoc(app);
// export const Doc = getDoc(app);



// // Correct import for Firebase v9 modular SDK
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication and export it for use
// export const auth = getAuth(app);
// export default app;
