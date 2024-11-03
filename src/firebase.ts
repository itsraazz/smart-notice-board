import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "notice-board-app.firebaseapp.com",
  projectId: "notice-board-app",
  storageBucket: "notice-board-app.appspot.com",
  messagingSenderId: "581326886241",
  appId: "1:581326886241:web:c56de0b1f381e76ea2c110"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);