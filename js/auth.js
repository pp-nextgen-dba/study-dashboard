import { auth } from "./firebase.js";
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function requireAuth(redirectPath = "/index.html") {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user);
            } else {
                window.location.href = redirectPath;
            }
        });
    });
}

export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

export function signOut() {
    return firebaseSignOut(auth);
}

export { onAuthStateChanged, auth };
