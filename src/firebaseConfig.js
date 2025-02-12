// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDyKsphXa_IlLnYH4v_meaGdhg_OjNV3rg",
  authDomain: "smartirrigation-823c7.firebaseapp.com",
  databaseURL: "https://smartirrigation-823c7-default-rtdb.firebaseio.com",
  projectId: "smartirrigation-823c7",
  storageBucket: "smartirrigation-823c7.firebasestorage.app",
  messagingSenderId: "734569934797",
  appId: "1:734569934797:web:d45b28b360ca74af8d9e84"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database
const database = getDatabase(app);

export { database };
