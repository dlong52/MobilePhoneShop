// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { initializeAuth } from 'firebase/auth';

import { getStorage} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDa-9y0MjKXPelQ2XgRF6pOtA0kW3mEhBo",
  authDomain: "information-project-65cca.firebaseapp.com",
  projectId: "information-project-65cca",
  storageBucket: "information-project-65cca.appspot.com",
  messagingSenderId: "768249864270",
  appId: "1:768249864270:web:10e2e15aa5978e1d45231f",
  measurementId: "G-L8HS1B9LNR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app)
export const auth = initializeAuth(app);

export const images = getStorage(app)