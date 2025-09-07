// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdQJ_4SVawOSuxTA4hHNomON4Jj9TOb8A",
  authDomain: "aseta-993bc.firebaseapp.com",
  projectId: "aseta-993bc",
  storageBucket: "aseta-993bc.firebasestorage.app",
  messagingSenderId: "584707999166",
  appId: "1:584707999166:web:2429efe4af6243d21ae5ef",
  measurementId: "G-3JG5EVEE8K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;