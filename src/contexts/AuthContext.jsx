import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isDevMode } from '../config/firebase';

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
  const [mockMode, setMockMode] = useState(isDevMode()); // Usa a mesma detecção dos serviços

  function signup(email, password) {
    if (mockMode) {
      // Signup mockado
      console.log('🔧 [DEV MODE] Signup mock não implementado ainda');
      return Promise.reject(new Error('Signup mock não disponível'));
    }
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password) {
    if (mockMode && mockUsers[email]) {
      // Login mockado
      const userData = mockUsers[email];
      
      console.log('🔧 [DEV MODE] Login mockado para:', email);
      console.log('📋 [DEV MODE] Dados do usuário:', userData);
      
      // Simular um tempo de resposta para melhor UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verificar senha (simulado)
      if (password !== '123456') {
        console.error('❌ [DEV MODE] Senha incorreta para login mockado (use: 123456)');
        throw new Error('Email ou senha incorretos');
      }
      
      // Definir usuário atual
      setCurrentUser(userData);
      setUserRole(userData.role);
      
      console.log('✅ [DEV MODE] Login realizado com sucesso! Role:', userData.role);
      
      // Salvar na sessão
      sessionStorage.setItem('mockUser', JSON.stringify(userData));
      
      return userData;
    } else if (mockMode) {
      // Email não encontrado no mock
      console.error('❌ [DEV MODE] Email não encontrado nos dados mock:', email);
      console.log('📋 [DEV MODE] Emails disponíveis para teste:');
      console.log('   - cliente@ssxsolar.com (senha: 123456)');
      console.log('   - instalador@ssxsolar.com (senha: 123456)');
      console.log('   - admin@ssxsolar.com (senha: 123456)');
      throw new Error('Email ou senha incorretos');
    } else {
      // Login real com Firebase
      return signInWithEmailAndPassword(auth, email, password);
    }
  }

  function logout() {
    if (mockMode) {
      // Logout mockado
      console.log('🔧 [DEV MODE] Logout mockado realizado');
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
      console.log('🔧 [DEV MODE] Reset de senha mockado para:', email);
      console.log('💡 [DEV MODE] No modo desenvolvimento, todas as senhas são: 123456');
      return Promise.resolve();
    } else {
      return sendPasswordResetEmail(auth, email);
    }
  }

  const getUserRole = useCallback(async (uid) => {
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
  }, [mockMode]);

  // Inicializar usuário mockado se existir na sessão
  useEffect(() => {
    console.log('🔧 [AUTH] Inicializando AuthContext...');
    console.log('🔧 [AUTH] Modo desenvolvimento:', mockMode ? 'ATIVADO' : 'DESATIVADO');
    
    if (mockMode) {
      const storedUser = sessionStorage.getItem('mockUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('🔧 [AUTH] Usuário mock encontrado na sessão:', userData.email);
          setCurrentUser(userData);
          setUserRole(userData.role);
        } catch (e) {
          console.warn('⚠️ [AUTH] Erro ao carregar usuário da sessão:', e);
          sessionStorage.removeItem('mockUser');
        }
      } else {
        console.log('🔧 [AUTH] Nenhum usuário mock na sessão');
      }
      setLoading(false);
    }
  }, [mockMode]);

  // Listener de autenticação do Firebase (só é usado quando não estamos em modo mockado)
  useEffect(() => {
    if (!mockMode) {
      console.log('🔥 [AUTH] Configurando listener do Firebase Auth...');
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('🔥 [AUTH] Estado de autenticação mudou:', user ? user.email : 'usuário não logado');
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
  }, [mockMode, getUserRole]);

  // Função para alternar modo mock (útil para desenvolvimento)
  const toggleMockMode = () => {
    const newMockMode = !mockMode;
    setMockMode(newMockMode);
    
    if (newMockMode) {
      // Mudando para modo mock - fazer logout do Firebase se necessário
      if (auth.currentUser) {
        signOut(auth);
      }
      setCurrentUser(null);
      setUserRole(null);
      sessionStorage.removeItem('mockUser');
    } else {
      // Mudando para modo real - limpar dados mock
      setCurrentUser(null);
      setUserRole(null);
      sessionStorage.removeItem('mockUser');
    }
    
    console.log('🔄 [AUTH] Modo alterado para:', newMockMode ? 'MOCK' : 'FIREBASE REAL');
  };

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    resetPassword,
    getUserRole,
    mockMode,
    setMockMode,
    toggleMockMode, // Função adicional para desenvolvimento
    isDevMode: mockMode // Alias para clareza
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 