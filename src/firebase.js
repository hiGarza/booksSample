import { firebase } from "@firebase/app";
import "@firebase/firestore";
import "@firebase/functions";

const firebaseApp = firebase.initializeApp({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
});

export const db = firebaseApp.firestore();
export const functions = firebaseApp.functions();