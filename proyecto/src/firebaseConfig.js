import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyACtV2X57tbQ2oxzKsWcLjC_dIdNLN65g4",
    authDomain: "superheroapi-f81e1.firebaseapp.com",
    projectId: "superheroapi-f81e1",
    storageBucket: "superheroapi-f81e1.firebasestorage.app",
    messagingSenderId: "419705815024",
    appId: "1:419705815024:web:48e7e8e0d9d6c3c3946735"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ ¡Esto es necesario!
export { auth, db };