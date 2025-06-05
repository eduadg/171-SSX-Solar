// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "ssx-solar.firebaseapp.com",
  projectId: "ssx-solar",
  storageBucket: "ssx-solar.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializar Firebase apenas se não estivermos em modo de teste/mock
let app, auth, db, storage;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase inicializado com sucesso");
} catch (error) {
  console.warn("Erro ao inicializar Firebase:", error.message);
  
  // Criar objetos mock para desenvolvimento sem Firebase
  app = {};
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    }
  };
  db = {
    collection: () => ({
      add: () => Promise.resolve({ id: 'mock-id' }),
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve()
      })
    }),
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => ({}) }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve()
    })
  };
  storage = {
    ref: () => ({
      put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('https://mock-url.com/image.jpg') } }),
      getDownloadURL: () => Promise.resolve('https://mock-url.com/image.jpg')
    })
  };
}

export { auth, db, storage };
export default app; 