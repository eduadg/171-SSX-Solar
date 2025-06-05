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

// Criar uma nova solicitação de serviço
export const createServiceRequest = async (serviceData) => {
  try {
    const serviceRequestRef = await addDoc(collection(db, 'serviceRequests'), {
      ...serviceData,
      status: SERVICE_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return { id: serviceRequestRef.id, ...serviceData };
  } catch (error) {
    console.error('Error creating service request:', error);
    throw error;
  }
};

// Obter solicitações de serviço de um cliente específico
export const getClientServiceRequests = async (clientId) => {
  try {
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
  } catch (error) {
    console.error('Error getting client service requests:', error);
    throw error;
  }
};

// Obter solicitações de serviço atribuídas a um instalador específico
export const getInstallerServiceRequests = async (installerId) => {
  try {
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
  } catch (error) {
    console.error('Error getting installer service requests:', error);
    throw error;
  }
};

// Obter todas as solicitações de serviço (para administradores)
export const getAllServiceRequests = async () => {
  try {
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
  } catch (error) {
    console.error('Error getting all service requests:', error);
    throw error;
  }
};

// Obter detalhes de uma solicitação de serviço específica
export const getServiceRequestById = async (requestId) => {
  try {
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
  } catch (error) {
    console.error('Error getting service request:', error);
    throw error;
  }
};

// Atualizar o status de uma solicitação de serviço
export const updateServiceRequestStatus = async (requestId, status, additionalData = {}) => {
  try {
    const docRef = doc(db, 'serviceRequests', requestId);
    
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData
    });
    
    return true;
  } catch (error) {
    console.error('Error updating service request status:', error);
    throw error;
  }
};

// Atribuir um instalador a uma solicitação de serviço
export const assignInstallerToServiceRequest = async (requestId, installerId) => {
  try {
    const docRef = doc(db, 'serviceRequests', requestId);
    
    await updateDoc(docRef, {
      installerId,
      status: SERVICE_STATUS.ASSIGNED,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error assigning installer to service request:', error);
    throw error;
  }
};

// Registrar início de um serviço
export const startServiceRequest = async (requestId) => {
  try {
    const docRef = doc(db, 'serviceRequests', requestId);
    
    await updateDoc(docRef, {
      status: SERVICE_STATUS.IN_PROGRESS,
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error starting service request:', error);
    throw error;
  }
};

// Registrar conclusão de um serviço
export const completeServiceRequest = async (requestId, notes) => {
  try {
    const docRef = doc(db, 'serviceRequests', requestId);
    
    await updateDoc(docRef, {
      status: SERVICE_STATUS.COMPLETED,
      completedAt: serverTimestamp(),
      technicalNotes: notes,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error completing service request:', error);
    throw error;
  }
};

// Confirmar conclusão de um serviço (cliente)
export const confirmServiceRequest = async (requestId) => {
  try {
    const docRef = doc(db, 'serviceRequests', requestId);
    
    await updateDoc(docRef, {
      status: SERVICE_STATUS.CONFIRMED,
      confirmedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error confirming service request:', error);
    throw error;
  }
};

// Fazer upload de imagem da instalação
export const uploadInstallationImage = async (requestId, file) => {
  try {
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
  } catch (error) {
    console.error('Error uploading installation image:', error);
    throw error;
  }
}; 