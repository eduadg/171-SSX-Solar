import { 
  collection, 
  updateDoc, 
  getDoc, 
  getDocs, 
  doc, 
  query, 
  where, 
  serverTimestamp,
  orderBy,
  deleteDoc 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Roles de usuário
export const USER_ROLES = {
  ADMIN: 'admin',
  INSTALLER: 'installer',
  CLIENT: 'client',
};

// 🔧 DETECÇÃO DE MODO DESENVOLVIMENTO
const isDevelopmentMode = () => {
  // Modo desenvolvimento se não tem configuração Firebase válida
  const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                           import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY';
  
  return !hasFirebaseConfig;
};

// 📊 DADOS MOCK DE USUÁRIOS
const mockUsers = [
  {
    id: 'client-123',
    uid: 'client-123',
    email: 'cliente@ssxsolar.com',
    name: 'Cliente Teste',
    role: USER_ROLES.CLIENT,
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123 - Vila Madalena, São Paulo, SP',
    cpf: '123.456.789-10',
    createdAt: { seconds: Math.floor(Date.now()/1000) - 2592000 }, // 30 dias atrás
    updatedAt: { seconds: Math.floor(Date.now()/1000) - 86400 }, // 1 dia atrás
  },
  {
    id: 'installer-123',
    uid: 'installer-123',
    email: 'instalador@ssxsolar.com',
    name: 'Instalador Teste',
    role: USER_ROLES.INSTALLER,
    phone: '(11) 88888-8888',
    specializations: ['solar_heater', 'gas_heater'],
    experience: '5 anos',
    region: 'São Paulo - Zona Sul',
    createdAt: { seconds: Math.floor(Date.now()/1000) - 5184000 }, // 60 dias atrás
    updatedAt: { seconds: Math.floor(Date.now()/1000) - 172800 }, // 2 dias atrás
  },
  {
    id: 'admin-123',
    uid: 'admin-123',
    email: 'admin@ssxsolar.com',
    name: 'Administrador Teste',
    role: USER_ROLES.ADMIN,
    phone: '(11) 77777-7777',
    permissions: ['all'],
    createdAt: { seconds: Math.floor(Date.now()/1000) - 7776000 }, // 90 dias atrás
    updatedAt: { seconds: Math.floor(Date.now()/1000) - 259200 }, // 3 dias atrás
  },
  // Usuários adicionais para cenários
  {
    id: 'client-456',
    uid: 'client-456',
    email: 'maria@cliente.com',
    name: 'Maria Santos',
    role: USER_ROLES.CLIENT,
    phone: '(11) 97654-3210',
    address: 'Av. Paulista, 456 - Bela Vista, São Paulo, SP',
    cpf: '987.654.321-00',
    createdAt: { seconds: Math.floor(Date.now()/1000) - 1296000 }, // 15 dias atrás
    updatedAt: { seconds: Math.floor(Date.now()/1000) - 43200 }, // 12 horas atrás
  },
  {
    id: 'installer-456',
    uid: 'installer-456',
    email: 'roberto@instalador.com',
    name: 'Roberto Lima',
    role: USER_ROLES.INSTALLER,
    phone: '(11) 92345-6789',
    specializations: ['solar_heater'],
    experience: '3 anos',
    region: 'São Paulo - Zona Norte',
    createdAt: { seconds: Math.floor(Date.now()/1000) - 3888000 }, // 45 dias atrás
    updatedAt: { seconds: Math.floor(Date.now()/1000) - 86400 }, // 1 dia atrás
  }
];

// 🚀 FUNÇÃO COM TIMEOUT E FALLBACK
const withTimeout = async (promise, timeoutMs = 5000) => {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  
  return Promise.race([promise, timeoutPromise]);
};

// Criar um novo usuário no Firebase Authentication e no Firestore
export const createUser = async (userData, password) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Criando usuário mock:', userData);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockId = `mock-user-${Date.now()}`;
    return {
      uid: mockId,
      ...userData,
      createdAt: { seconds: Math.floor(Date.now()/1000) },
      updatedAt: { seconds: Math.floor(Date.now()/1000) },
    };
  }

  try {
    return await withTimeout(async () => {
      // Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
      const uid = userCredential.user.uid;
      
      // Criar documento do usuário no Firestore
      const userDocRef = doc(db, 'users', uid);
      
      // Dados para salvar no Firestore
      const userDataToSave = {
        ...userData,
        uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Remover senha dos dados antes de salvar no Firestore
      delete userDataToSave.password;
      
      // Salvar no Firestore
      await updateDoc(userDocRef, userDataToSave);
      
      return { uid, ...userDataToSave };
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Obter um usuário pelo ID
export const getUserById = async (userId) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Buscando usuário mock por ID:', userId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockUser = mockUsers.find(user => user.id === userId || user.uid === userId);
    if (mockUser) {
      return mockUser;
    } else {
      throw new Error('User not found');
    }
  }

  try {
    return await withTimeout(async () => {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        };
      } else {
        throw new Error('User not found');
      }
    });
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Atualizar um usuário existente
export const updateUser = async (userId, userData) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Atualizando usuário mock:', { userId, userData });
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  }

  try {
    return await withTimeout(async () => {
      const userDocRef = doc(db, 'users', userId);
      
      await updateDoc(userDocRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });
      
      return true;
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Obter todos os instaladores
export const getAllInstallers = async () => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Retornando instaladores mock');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const installers = mockUsers.filter(user => user.role === USER_ROLES.INSTALLER);
    console.log(`🔧 [DEV MODE] Encontrados ${installers.length} instaladores mock`);
    return installers;
  }

  try {
    return await withTimeout(async () => {
      const q = query(
        collection(db, 'users'),
        where('role', '==', USER_ROLES.INSTALLER),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const installers = [];
      
      querySnapshot.forEach((doc) => {
        installers.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return installers;
    });
  } catch (error) {
    console.error('Error getting installers:', error);
    // Fallback para dados mock
    if (error.message === 'Request timeout') {
      console.warn('⚠️ Firebase timeout, usando dados mock como fallback');
      return mockUsers.filter(user => user.role === USER_ROLES.INSTALLER);
    }
    throw error;
  }
};

// Obter todos os clientes
export const getAllClients = async () => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Retornando clientes mock');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const clients = mockUsers.filter(user => user.role === USER_ROLES.CLIENT);
    console.log(`👥 [DEV MODE] Encontrados ${clients.length} clientes mock`);
    return clients;
  }

  try {
    return await withTimeout(async () => {
      const q = query(
        collection(db, 'users'),
        where('role', '==', USER_ROLES.CLIENT),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const clients = [];
      
      querySnapshot.forEach((doc) => {
        clients.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return clients;
    });
  } catch (error) {
    console.error('Error getting clients:', error);
    // Fallback para dados mock
    if (error.message === 'Request timeout') {
      console.warn('⚠️ Firebase timeout, usando dados mock como fallback');
      return mockUsers.filter(user => user.role === USER_ROLES.CLIENT);
    }
    throw error;
  }
};

// Excluir um usuário (apenas do Firestore, não do Authentication)
export const deleteUserData = async (userId) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Excluindo usuário mock:', userId);
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  }

  try {
    return await withTimeout(async () => {
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);
      
      return true;
    });
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
}; 