// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "notebook-demo-5cfa7.firebaseapp.com",
  projectId: "notebook-demo-5cfa7",
  storageBucket: "notebook-demo-5cfa7.appspot.com",
  messagingSenderId: "127337546597",
  appId: "1:127337546597:web:b9dc1e808ac5491e72d78c",
  measurementId: "G-PPL697HQHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);

export async function uploadFileToFirebaseUsingUrl(userId: string, imageUrl: string, name: string) {
  try {
    const response = await fetch(imageUrl);
    const buff = await response.arrayBuffer();
    const fileName = userId + "/" + name.replaceAll(' ', '') + '.jpeg';
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, buff, {
      contentType: 'image/jpeg'
    });
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (err) {
    console.error(err);
  }
}

export async function uploadFileToFirebase(userId: string, folder: string, file: File, title: string) {
  try {
    const suffix = title.replaceAll(' ', '_') + file.name;
    const fileName = userId + "/" + folder + "/" + suffix;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file, {
      contentType: file.type
    });
    
    const downloadUrl = await getDownloadURL(storageRef);
    return {downloadUrl : downloadUrl, fileName : suffix};
  } catch (err) {
    console.error(err);
  }
}

export async function deleteFileFromFirebase(userId: string, folderName : string, suffix: string) {
  try {
    const fileName = userId + "/" + folderName + "/" + suffix;
    const storageRef = ref(storage, fileName);
    await deleteObject(storageRef);
  } catch (err) {
    console.error(err);
  }
}