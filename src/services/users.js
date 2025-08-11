import { 
  collection, 
  updateDoc, 
  getDoc, 
  getDocs, 
  addDoc,
  doc, 
  query, 
  where, 
  serverTimestamp,
  orderBy,
  deleteDoc 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import mockPersistence from './mockPersistence';

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

// Obter um usuário pelo ID (exportar para uso no Profile)
export const getUserById = async (userId) => {
  if (isDevelopmentMode()) {
    const mockUser = mockUsers.find(user => user.id === userId || user.uid === userId);
    if (mockUser) return mockUser;
    // fallback: mockPersistence
    const persisted = mockPersistence.getUserById(userId);
    if (persisted) return persisted;
    throw new Error('User not found');
  }
  try {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('User not found');
    return { id: snap.id, ...(snap.data() || {}) };
  } catch (e) {
    console.error('[users] getUserById error:', e);
    throw e;
  }
};

// Atualizar um usuário existente
export const updateUser = async (userId, userData) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Atualizando usuário mock:', { userId, userData });
    await new Promise(resolve => setTimeout(resolve, 400));
    mockPersistence.updateUser(userId, userData);
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

// Campos personalizados por instalador (definidos pelo admin)
export const getInstallerCustomFields = async (installerId) => {
  if (isDevelopmentMode()) {
    return mockPersistence.getInstallerFieldDefinitions(installerId);
  }
  try {
    const defsSnap = await getDocs(collection(db, 'users', installerId, 'profileFieldDefs'));
    const defs = defsSnap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
    // Normalizar saída para [{ key, label }]
    return defs.map(d => ({ key: d.key, label: d.label })).filter(f => f.key && f.label);
  } catch (e) {
    console.error('[users] getInstallerCustomFields error:', e);
    return [];
  }
};

export const setInstallerCustomFields = async (installerId, fields) => {
  if (isDevelopmentMode()) {
    return mockPersistence.setInstallerFieldDefinitions(installerId, fields);
  }
  try {
    // Apagar definições atuais
    const colRef = collection(db, 'users', installerId, 'profileFieldDefs');
    const current = await getDocs(colRef);
    await Promise.all(current.docs.map(d => deleteDoc(doc(db, 'users', installerId, 'profileFieldDefs', d.id))));
    // Inserir novas
    const sanitized = (Array.isArray(fields) ? fields : []).filter(f => f.key && f.label);
    await Promise.all(sanitized.map(f => addDoc(colRef, { key: f.key, label: f.label, updatedAt: serverTimestamp() })));
    return sanitized;
  } catch (e) {
    console.error('[users] setInstallerCustomFields error:', e);
    return [];
  }
};

// Solicitações de alteração de perfil
export const createProfileChangeRequest = async ({ userId, updates }) => {
  if (isDevelopmentMode()) {
    return mockPersistence.addProfileChangeRequest({ userId, updates });
  }
  try {
    const ref = await addDoc(collection(db, 'profileChangeRequests'), {
      userId,
      updates,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: ref.id };
  } catch (e) {
    console.error('[users] createProfileChangeRequest error:', e);
    throw e;
  }
};

export const listProfileChangeRequests = async (status) => {
  if (isDevelopmentMode()) {
    return mockPersistence.getProfileChangeRequests(status);
  }
  try {
    const base = collection(db, 'profileChangeRequests');
    let q = base;
    if (status) {
      q = query(base, where('status', '==', status));
    }
    const snap = await getDocs(q);
    // Ordenar no cliente por createdAt desc (evita necessidade de índice composto)
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
    return items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  } catch (e) {
    console.error('[users] listProfileChangeRequests error:', e);
    return [];
  }
};

export const approveProfileChangeRequest = async (requestId) => {
  if (isDevelopmentMode()) {
    return mockPersistence.approveProfileChangeRequest(requestId);
  }
  try {
    const reqRef = doc(db, 'profileChangeRequests', requestId);
    const reqSnap = await getDoc(reqRef);
    if (!reqSnap.exists()) throw new Error('Request not found');
    const data = reqSnap.data();
    // Aplicar no usuário
    const userRef = doc(db, 'users', data.userId);
    await updateDoc(userRef, { ...(data.updates || {}), updatedAt: serverTimestamp() });
    // Marcar como aprovado
    await updateDoc(reqRef, { status: 'approved', updatedAt: serverTimestamp() });
    return { id: requestId, ...data, status: 'approved' };
  } catch (e) {
    console.error('[users] approveProfileChangeRequest error:', e);
    throw e;
  }
};

export const rejectProfileChangeRequest = async (requestId, reason) => {
  if (isDevelopmentMode()) {
    return mockPersistence.rejectProfileChangeRequest(requestId, reason);
  }
  try {
    const reqRef = doc(db, 'profileChangeRequests', requestId);
    await updateDoc(reqRef, { status: 'rejected', rejectionReason: reason || '', updatedAt: serverTimestamp() });
    return { id: requestId, status: 'rejected' };
  } catch (e) {
    console.error('[users] rejectProfileChangeRequest error:', e);
    throw e;
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
    return await withTimeout((async () => {
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
      console.log(`[FIREBASE] Instaladores encontrados:`, installers);
      return Array.isArray(installers) ? installers : [];
    })());
  } catch (error) {
    console.error('Error getting installers:', error);
    // Fallback para dados mock
    if (error.message === 'Request timeout') {
      console.warn('⚠️ Firebase timeout, usando dados mock como fallback');
      return mockUsers.filter(user => user.role === USER_ROLES.INSTALLER);
    }
    return [];
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
    return await withTimeout((async () => {
      const q = query(
        collection(db, 'users'),
        where('role', '==', USER_ROLES.CLIENT),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const clients = [];
      querySnapshot.forEach((doc) => {
        clients.push({ id: doc.id, ...doc.data() });
      });
      return clients;
    })());
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