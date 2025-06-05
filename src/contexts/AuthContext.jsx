import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

// Dados mockados para desenvolvimento rápido
const mockUsers = {
  'cliente@ssxsolar.com': {
    uid: 'client-123',
    email: 'cliente@ssxsolar.com',
    role: 'client',
    name: 'Cliente Teste',
    phone: '(11) 99999-9999'
  },
  'instalador@ssxsolar.com': {
    uid: 'installer-123',
    email: 'instalador@ssxsolar.com',
    role: 'installer',
    name: 'Instalador Teste',
    phone: '(11) 88888-8888'
  },
  'admin@ssxsolar.com': {
    uid: 'admin-123',
    email: 'admin@ssxsolar.com',
    role: 'admin',
    name: 'Administrador Teste',
    phone: '(11) 77777-7777'
  }
};

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mockMode, setMockMode] = useState(true); // Ativar modo mockado

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password) {
    if (mockMode && mockUsers[email]) {
      // Login mockado
      const userData = mockUsers[email];
      
      console.log('Login mockado para:', email);
      console.log('Dados do usuário:', userData);
      
      // Simular um tempo de resposta para melhor UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verificar senha (simulado)
      if (password !== '123456') {
        console.error('Senha incorreta para login mockado');
        throw new Error('Senha incorreta');
      }
      
      // Definir usuário atual
      setCurrentUser(userData);
      setUserRole(userData.role);
      
      console.log('Role definida como:', userData.role);
      
      // Salvar na sessão
      sessionStorage.setItem('mockUser', JSON.stringify(userData));
      
      return userData;
    } else {
      // Login real com Firebase
      return signInWithEmailAndPassword(auth, email, password);
    }
  }

  function logout() {
    if (mockMode) {
      // Logout mockado
      setCurrentUser(null);
      setUserRole(null);
      sessionStorage.removeItem('mockUser');
      return Promise.resolve();
    } else {
      // Logout real
      return signOut(auth);
    }
  }

  function resetPassword(email) {
    if (mockMode) {
      // Reset de senha mockado
      console.log('Reset de senha mockado para:', email);
      return Promise.resolve();
    } else {
      return sendPasswordResetEmail(auth, email);
    }
  }

  async function getUserRole(uid) {
    try {
      if (mockMode) {
        // Buscar role do usuário mockado
        const mockUser = Object.values(mockUsers).find(user => user.uid === uid);
        if (mockUser) {
          setUserRole(mockUser.role);
          return mockUser.role;
        }
        return null;
      } else {
        // Buscar role do usuário real
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
          return userData.role;
        }
        
        return null;
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  }

  // Inicializar usuário mockado se existir na sessão
  useEffect(() => {
    if (mockMode) {
      const storedUser = sessionStorage.getItem('mockUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setUserRole(userData.role);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [mockMode]);

  // Listener de autenticação do Firebase (só é usado quando não estamos em modo mockado)
  useEffect(() => {
    if (!mockMode) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
          await getUserRole(user.uid);
        } else {
          setUserRole(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    }
  }, [mockMode]);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    resetPassword,
    getUserRole,
    mockMode,
    setMockMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 