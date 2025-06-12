// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// 🔧 DETECÇÃO DE MODO DESENVOLVIMENTO
const isDevelopmentMode = () => {
  // Modo desenvolvimento se não tem configuração Firebase válida (.env.local)
  const hasValidApiKey = import.meta.env.VITE_FIREBASE_API_KEY && 
                         import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY';
  
  return !hasValidApiKey;
};

// 📋 CONFIGURAÇÃO DO FIREBASE
const getFirebaseConfig = () => {
  // Tenta usar variáveis de ambiente primeiro
  if (import.meta.env.VITE_FIREBASE_API_KEY && 
      import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY') {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };
  }
  
  // Fallback para configuração de desenvolvimento
  return {
    apiKey: "demo-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:demo",
    measurementId: "G-DEMO"
  };
};

// Inicializar Firebase apenas se não estivermos em modo de desenvolvimento
let app, auth, db, storage, analytics;

const firebaseConfig = getFirebaseConfig();

if (isDevelopmentMode()) {
  console.log('🔧 [FIREBASE] Modo desenvolvimento detectado - usando dados mock');
  console.log('🔧 [FIREBASE] Para usar Firebase real, configure as variáveis de ambiente:');
  console.log('   - VITE_FIREBASE_API_KEY');
  console.log('   - VITE_FIREBASE_AUTH_DOMAIN');
  console.log('   - VITE_FIREBASE_PROJECT_ID');
  console.log('   - etc...');
  
  // Criar objetos mock para desenvolvimento sem Firebase
  app = { name: '[MOCK]' };
  
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
    signInWithEmailAndPassword: () => Promise.reject(new Error('Mock auth - use modo desenvolvimento')),
    createUserWithEmailAndPassword: () => Promise.reject(new Error('Mock auth - use modo desenvolvimento')),
    signOut: () => Promise.resolve(),
    sendPasswordResetEmail: () => Promise.resolve()
  };
  
  db = {
    collection: () => ({
      add: () => Promise.reject(new Error('Mock Firestore - use modo desenvolvimento')),
      doc: () => ({
        get: () => Promise.reject(new Error('Mock Firestore - use modo desenvolvimento')),
        set: () => Promise.reject(new Error('Mock Firestore - use modo desenvolvimento')),
        update: () => Promise.reject(new Error('Mock Firestore - use modo desenvolvimento'))
      })
    }),
    doc: () => ({
      get: () => Promise.reject(new Error('Mock Firestore - use modo desenvolvimento')),
      set: () => Promise.reject(new Error('Mock Firestore - use modo desenvolvimento')),
      update: () => Promise.reject(new Error('Mock Firestore - use modo desenvolvimento'))
    })
  };
  
  storage = {
    ref: () => ({
      put: () => Promise.reject(new Error('Mock Storage - use modo desenvolvimento')),
      getDownloadURL: () => Promise.reject(new Error('Mock Storage - use modo desenvolvimento'))
    })
  };
  
  analytics = {
    logEvent: () => console.log('📊 [MOCK] Analytics event logged'),
    setUserProperties: () => console.log('📊 [MOCK] User properties set')
  };
} else {
  try {
    console.log('🔥 [FIREBASE] Inicializando Firebase com configuração real...');
    
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Initialize Analytics (only in production)
    try {
      analytics = getAnalytics(app);
      console.log('📊 [FIREBASE] Analytics inicializado');
    } catch (error) {
      console.warn('⚠️ [FIREBASE] Analytics não disponível:', error.message);
      analytics = {
        logEvent: () => console.log('📊 [FALLBACK] Analytics event logged'),
        setUserProperties: () => console.log('📊 [FALLBACK] User properties set')
      };
    }
    
    // Configurações para evitar erros de conexão em desenvolvimento
    if (import.meta.env.MODE === 'development') {
      // Só conecta aos emuladores se estiverem disponíveis
      try {
        if (!auth._delegate._isInitialized) {
          connectAuthEmulator(auth, 'http://localhost:9099');
        }
      } catch {
        console.log('Auth emulator não disponível, usando Firebase produção');
      }
      
      try {
        if (!db._delegate._databaseId) {
          connectFirestoreEmulator(db, 'localhost', 8080);
        }
      } catch {
        console.log('Firestore emulator não disponível, usando Firebase produção');
      }
      
      try {
        connectStorageEmulator(storage, 'localhost', 9199);
      } catch {
        console.log('Storage emulator não disponível, usando Firebase produção');
      }
    }
    
    console.log('✅ [FIREBASE] Firebase inicializado com sucesso');
    console.log('📊 [FIREBASE] Projeto:', firebaseConfig.projectId);
    
  } catch (error) {
    console.error('❌ [FIREBASE] Erro ao inicializar Firebase:', error.message);
    console.warn('⚠️ [FIREBASE] Caindo de volta para modo desenvolvimento...');
    
    // Fallback para objetos mock se a inicialização falhar
    app = { name: '[MOCK-FALLBACK]' };
    auth = {
      currentUser: null,
      onAuthStateChanged: (callback) => { callback(null); return () => {}; },
      signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase não disponível')),
      createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase não disponível')),
      signOut: () => Promise.resolve(),
      sendPasswordResetEmail: () => Promise.resolve()
    };
    db = {
      collection: () => ({ add: () => Promise.reject(new Error('Firebase não disponível')) }),
      doc: () => ({ get: () => Promise.reject(new Error('Firebase não disponível')) })
    };
    storage = {
      ref: () => ({ put: () => Promise.reject(new Error('Firebase não disponível')) })
    };
    analytics = {
      logEvent: () => console.log('📊 [FALLBACK] Analytics event logged'),
      setUserProperties: () => console.log('📊 [FALLBACK] User properties set')
    };
  }
}

// Função para verificar se Firebase está disponível
export const isFirebaseAvailable = () => {
  return !isDevelopmentMode() && app && app.name !== '[MOCK]' && app.name !== '[MOCK-FALLBACK]';
};

// Função para verificar se estamos em modo desenvolvimento
export const isDevMode = isDevelopmentMode;

export { auth, db, storage, analytics };
export default app; 