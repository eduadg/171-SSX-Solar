import { 
  collection, 
  addDoc, 
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

// Criar um novo usuário no Firebase Authentication e no Firestore
export const createUser = async (userData, password) => {
  try {
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
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Obter um usuário pelo ID
export const getUserById = async (userId) => {
  try {
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
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Atualizar um usuário existente
export const updateUser = async (userId, userData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Obter todos os instaladores
export const getAllInstallers = async () => {
  try {
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
  } catch (error) {
    console.error('Error getting installers:', error);
    throw error;
  }
};

// Obter todos os clientes
export const getAllClients = async () => {
  try {
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
  } catch (error) {
    console.error('Error getting clients:', error);
    throw error;
  }
};

// Excluir um usuário (apenas do Firestore, não do Authentication)
export const deleteUserData = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await deleteDoc(userDocRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
}; 