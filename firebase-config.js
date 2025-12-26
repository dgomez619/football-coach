// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD44kUpGifS73IICPc_tkmSqTnwgx8_U1w",
  authDomain: "coachmark-c27a1.firebaseapp.com",
  projectId: "coachmark-c27a1",
  storageBucket: "coachmark-c27a1.firebasestorage.app",
  messagingSenderId: "833469509410",
  appId: "1:833469509410:web:7c14bdb4abdc8d2a833f7b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);