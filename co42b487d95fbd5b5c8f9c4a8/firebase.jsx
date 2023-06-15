import { initializeApp } from "firebase/app";
import { getFirestore, collection} from "firebase/firestore"

const firebaseConfig = {

    apiKey: "AIzaSyA3dIOtMWgJFcApD3T4Spls9y2mk4B1erI",
    authDomain: "reactnotes1312.firebaseapp.com",
    projectId: "reactnotes1312",
    storageBucket: "reactnotes1312.appspot.com",
    messagingSenderId: "216928655443",
    appId: "1:216928655443:web:d3e9aaa4bacce787218ea6"

}


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")
