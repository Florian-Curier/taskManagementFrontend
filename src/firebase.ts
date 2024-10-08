import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAck1qjvipjXZZIjn42gJX42b19iJSW_qw",
    authDomain: "taskmanagement-5794c.firebaseapp.com",
    projectId: "taskmanagement-5794c",
    storageBucket: "taskmanagement-5794c.appspot.com",
    messagingSenderId: "811558063361",
    appId: "1:811558063361:web:b20b60501bf2d85ebe1f00",
    measurementId: "G-9CESV4GCZ6"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firebase Auth et Google
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Fonction pour se connecter avec Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log('Utilisateur connecté avec Google : ', user);
        return user;
    } catch (error) {
        console.error('Erreur lors de la connexion avec Google : ', error);
        throw error;
    }
};

// Exportation d'auth pour l'utiliser ailleurs si nécessaire
export { auth };