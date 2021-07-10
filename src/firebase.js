import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCt_P_2A6NDjaHPgnZgtmiHpEtYwH3jE2c",
    authDomain: "instagram-clone-3ac7f.firebaseapp.com",
    databaseURL: "https://instagram-clone-3ac7f-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-3ac7f",
    storageBucket: "instagram-clone-3ac7f.appspot.com",
    messagingSenderId: "665447368279",
    appId: "1:665447368279:web:3deb6e577206f76ce5c512",
    measurementId: "G-F50GZ8WRHV"
});

const db =firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage}; 