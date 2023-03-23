import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";
import {
  collection,
  updateDoc,
  doc,
  arrayUnion,
  onSnapshot,
  setDoc,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBe85GFiZiNaIJ36FoDNnOv4jtxQ-SurTc",
  authDomain: "note-eab29.firebaseapp.com",
  projectId: "note-eab29",
  storageBucket: "note-eab29.appspot.com",
  messagingSenderId: "1074319979452",
  appId: "1:1074319979452:web:614dd46f6d45f632a3b1b9",
  measurementId: "G-YR6KEDDP2M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addUser = async (
  Name: string,
  docId: string,
  subDocId: string,
  sendAt: Date,
  message: string,
  sendBy: string
) => {
  try {
    const userCollectionRef = collection(db, "user");
    const userDocRef = doc(userCollectionRef, docId);

    await setDoc(userDocRef, { Name: Name, id: docId });

    const subCollectionRef = collection(userDocRef, "user_chat");
    const subDocRef = doc(subCollectionRef, subDocId);

    await setDoc(subDocRef, { chats: [{ sendAt, message, sendBy }] });
  } catch (error) {
    throw error;
  }
};

export const addMessage = async (
  docId: string,
  subDocId: string,
  sendAt: Date,
  message: string,
  sendBy: string
) => {
  try {
    const userCollectionRef = collection(db, "user");
    const userDocRef = doc(userCollectionRef, docId);

    const subCollectionRef = collection(userDocRef, "user_chat");
    const subDocRef = doc(subCollectionRef, subDocId);

    const subDocSnapshot = await getDoc(subDocRef);
    if (subDocSnapshot.exists()) {
      // If the subdocument already exists, add the new chat object to its chats array
      await updateDoc(subDocRef, {
        chats: arrayUnion({ sendAt, message, sendBy }),
      });
    } else {
      // If the subdocument doesn't exist, create a new document with the subDocId and set its chats field to an array containing the new chat object
      await setDoc(subDocRef, { chats: [{ sendAt, message, sendBy }] });
    }
  } catch (error) {
    throw error;
  }
};

export const listenForChatUpdates = (
  docId: string,
  subDocId: string,
  callback: (chats: any[]) => void
) => {
  try {
    const userCollectionRef = collection(db, "user");
    const userDocRef = doc(userCollectionRef, docId);

    const subCollectionRef = collection(userDocRef, "user_chat");
    const subDocRef = doc(subCollectionRef, subDocId);

    return onSnapshot(subDocRef, (doc) => {
      if (doc.exists()) {
        const chats = doc.data().chats;
        callback(chats);
      } else {
        callback([]);
      }
    });
  } catch (error) {
    throw error;
  }
};

export const storage = getStorage(app);
export default app;
