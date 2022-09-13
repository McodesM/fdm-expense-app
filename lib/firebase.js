import { initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDaNcEKKUAQad3J4FktMlvTS9T17XgSi-I",
    authDomain: "fdm-expenses-fb590.firebaseapp.com",
    databaseURL: "https://fdm-expenses-fb590-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fdm-expenses-fb590",
    storageBucket: "fdm-expenses-fb590.appspot.com",
    messagingSenderId: "727287515703",
    appId: "1:727287515703:web:aa61e76f1fe059b3188db2",
    measurementId: "G-26M86ZGWS4"
};


const firebase = initializeApp(firebaseConfig);
export const app = getApp("[DEFAULT]");
export const auth = getAuth(app);
export const db = getFirestore(firebase);
export const storage = getStorage(firebase);



