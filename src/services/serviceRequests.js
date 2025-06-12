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
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import mockPersistence from './mockPersistence';

// Status do serviço
export const SERVICE_STATUS = {
  PENDING: 'pending',          // Aguardando aprovação
  APPROVED: 'approved',        // Aprovado, aguardando designação
  ASSIGNED: 'assigned',        // Atribuído a um instalador
  IN_PROGRESS: 'in_progress',  // Em andamento
  COMPLETED: 'completed',      // Concluído
  CONFIRMED: 'confirmed',      // Confirmado pelo cliente
  CANCELLED: 'cancelled',      // Cancelado
};

// Tipos de equipamentos
export const EQUIPMENT_TYPES = {
  SOLAR_HEATER: 'solar_heater',
  GAS_HEATER: 'gas_heater',
};

// 🔧 DETECÇÃO DE MODO DESENVOLVIMENTO
const isDevelopmentMode = () => {
  // Modo desenvolvimento se não tem configuração Firebase válida
  const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                           import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY';
  
  return !hasFirebaseConfig;
};

// Função para obter dados mock persistentes (usa mockPersistence)
export const getMockServiceRequests = () => {
  return mockPersistence.getServiceRequests();
};

// 🚀 FUNÇÃO COM TIMEOUT E FALLBACK
const withTimeout = async (promise, timeoutMs = 5000) => {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  
  return Promise.race([promise, timeoutPromise]);
};

// 📝 FUNÇÕES PRINCIPAIS COM MODO DESENVOLVIMENTO

// Criar uma nova solicitação de serviço
export const createServiceRequest = async (serviceData) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Criando solicitação mock:', serviceData);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay de rede
    
    // Usar mockPersistence para persistir a solicitação
    const newRequest = mockPersistence.addServiceRequest({
      ...serviceData,
      status: SERVICE_STATUS.PENDING
    });
    
    console.log('✅ [DEV MODE] Solicitação criada e persistida:', newRequest.id);
    return newRequest;
  }

  try {
    return await withTimeout(async () => {
      const serviceRequestRef = await addDoc(collection(db, 'serviceRequests'), {
        ...serviceData,
        status: SERVICE_STATUS.PENDING,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return { id: serviceRequestRef.id, ...serviceData };
    });
  } catch (error) {
    console.error('Error creating service request:', error);
    throw error;
  }
};

// Obter solicitações de serviço de um cliente específico
export const getClientServiceRequests = async (clientId) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Buscando solicitações mock para cliente:', clientId);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simula delay de rede
    
    const clientRequests = mockPersistence.getServiceRequestsByClientId(clientId);
    console.log(`📋 [DEV MODE] Encontradas ${clientRequests.length} solicitações para cliente ${clientId}`);
    return clientRequests.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
  }

  try {
    return await withTimeout(async () => {
      const q = query(
        collection(db, 'serviceRequests'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const serviceRequests = [];
      
      querySnapshot.forEach((doc) => {
        serviceRequests.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return serviceRequests;
    });
  } catch (error) {
    console.error('Error getting client service requests:', error);
    // Fallback para dados mock em caso de erro
    console.warn('⚠️ Firebase erro, usando dados mock como fallback');
    return mockPersistence.getServiceRequestsByClientId(clientId);
  }
};

// Obter solicitações de serviço atribuídas a um instalador específico
export const getInstallerServiceRequests = async (installerId) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Buscando solicitações mock para instalador:', installerId);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const installerRequests = mockPersistence.getServiceRequestsByInstallerId(installerId);
    console.log(`🔧 [DEV MODE] Encontradas ${installerRequests.length} solicitações para instalador ${installerId}`);
    return installerRequests.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
  }

  try {
    return await withTimeout(async () => {
      const q = query(
        collection(db, 'serviceRequests'),
        where('installerId', '==', installerId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const serviceRequests = [];
      
      querySnapshot.forEach((doc) => {
        serviceRequests.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return serviceRequests;
    });
  } catch (error) {
    console.error('Error getting installer service requests:', error);
    // Fallback para dados mock
    console.warn('⚠️ Firebase erro, usando dados mock como fallback');
    return mockPersistence.getServiceRequestsByInstallerId(installerId);
  }
};

// Obter todas as solicitações de serviço (para administradores)
export const getAllServiceRequests = async () => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Retornando todas as solicitações mock');
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const allRequests = mockPersistence.getServiceRequests();
    console.log(`📊 [DEV MODE] Total de ${allRequests.length} solicitações mockadas`);
    return allRequests.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
  }

  try {
    return await withTimeout(async () => {
      const q = query(
        collection(db, 'serviceRequests'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const serviceRequests = [];
      
      querySnapshot.forEach((doc) => {
        serviceRequests.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return serviceRequests;
    });
  } catch (error) {
    console.error('Error getting all service requests:', error);
    // Fallback para dados mock
    console.warn('⚠️ Firebase erro, usando dados mock como fallback');
    return mockPersistence.getServiceRequests();
  }
};

// Obter detalhes de uma solicitação de serviço específica
export const getServiceRequestById = async (requestId) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Buscando solicitação mock por ID:', requestId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockRequest = mockPersistence.getServiceRequestById(requestId);
    if (mockRequest) {
      return mockRequest;
    } else {
      throw new Error('Service request not found');
    }
  }

  try {
    return await withTimeout(async () => {
      const docRef = doc(db, 'serviceRequests', requestId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Service request not found');
      }
    });
  } catch (error) {
    console.error('Error getting service request:', error);
    throw error;
  }
};

// Atualizar o status de uma solicitação de serviço
export const updateServiceRequestStatus = async (requestId, status, additionalData = {}) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Atualizando status mock:', { requestId, status, additionalData });
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
      const updatedRequest = mockPersistence.updateServiceRequest(requestId, {
        status,
        ...additionalData
      });
      console.log('✅ [DEV MODE] Status atualizado:', updatedRequest.id);
      return updatedRequest;
    } catch (error) {
      console.error('❌ [DEV MODE] Erro ao atualizar status:', error);
      throw error;
    }
  }

  try {
    return await withTimeout(async () => {
      const docRef = doc(db, 'serviceRequests', requestId);
      
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
        ...additionalData
      });
      
      return true;
    });
  } catch (error) {
    console.error('Error updating service request status:', error);
    throw error;
  }
};

// Atribuir um instalador a uma solicitação de serviço
export const assignInstallerToServiceRequest = async (requestId, installerId) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Atribuindo instalador mock:', { requestId, installerId });
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
      // Buscar dados do instalador para adicionar ao request
      const installer = mockPersistence.getUserById(installerId);
      const updatedRequest = mockPersistence.updateServiceRequest(requestId, {
        installerId,
        installerName: installer?.name || 'Instalador',
        status: SERVICE_STATUS.ASSIGNED
      });
      console.log('✅ [DEV MODE] Instalador atribuído:', updatedRequest.id);
      return updatedRequest;
    } catch (error) {
      console.error('❌ [DEV MODE] Erro ao atribuir instalador:', error);
      throw error;
    }
  }

  try {
    return await withTimeout(async () => {
      const docRef = doc(db, 'serviceRequests', requestId);
      
      await updateDoc(docRef, {
        installerId,
        status: SERVICE_STATUS.ASSIGNED,
        updatedAt: serverTimestamp(),
      });
      
      return true;
    });
  } catch (error) {
    console.error('Error assigning installer to service request:', error);
    throw error;
  }
};

// Registrar início de um serviço
export const startServiceRequest = async (requestId) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Iniciando serviço mock:', requestId);
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }

  try {
    return await withTimeout(async () => {
      const docRef = doc(db, 'serviceRequests', requestId);
      
      await updateDoc(docRef, {
        status: SERVICE_STATUS.IN_PROGRESS,
        startedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return true;
    });
  } catch (error) {
    console.error('Error starting service request:', error);
    throw error;
  }
};

// Registrar conclusão de um serviço
export const completeServiceRequest = async (requestId, notes) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Concluindo serviço mock:', { requestId, notes });
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  }

  try {
    return await withTimeout(async () => {
      const docRef = doc(db, 'serviceRequests', requestId);
      
      await updateDoc(docRef, {
        status: SERVICE_STATUS.COMPLETED,
        completedAt: serverTimestamp(),
        technicalNotes: notes,
        updatedAt: serverTimestamp(),
      });
      
      return true;
    });
  } catch (error) {
    console.error('Error completing service request:', error);
    throw error;
  }
};

// Confirmar conclusão de um serviço (cliente)
export const confirmServiceRequest = async (requestId) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Confirmando serviço mock:', requestId);
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }

  try {
    return await withTimeout(async () => {
      const docRef = doc(db, 'serviceRequests', requestId);
      
      await updateDoc(docRef, {
        status: SERVICE_STATUS.CONFIRMED,
        confirmedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return true;
    });
  } catch (error) {
    console.error('Error confirming service request:', error);
    throw error;
  }
};

// Fazer upload de imagem da instalação
export const uploadInstallationImage = async (requestId, file) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Upload mock de imagem:', { requestId, fileName: file?.name });
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simula upload
    return `https://picsum.photos/800/600?random=${Date.now()}`;
  }

  try {
    return await withTimeout(async () => {
      const storageRef = ref(storage, `installations/${requestId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const docRef = doc(db, 'serviceRequests', requestId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const images = data.images || [];
        
        await updateDoc(docRef, {
          images: [...images, { url: downloadURL, uploadedAt: serverTimestamp() }],
          updatedAt: serverTimestamp(),
        });
      }
      
      return downloadURL;
    }, 10000); // Upload tem timeout maior
  } catch (error) {
    console.error('Error uploading installation image:', error);
    throw error;
  }
}; 