import { 
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import mockPersistence from './mockPersistence';

const isDev = () => {
  const hasFirebase = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY';
  return !hasFirebase;
};

// ===== KPIs =====
export const getKpis = async () => {
  if (isDev()) {
    const all = mockPersistence.getServiceRequests();
    return computeKpisFromRequests(all);
  }
  const snap = await getDocs(collection(db, 'serviceRequests'));
  const list = snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
  return computeKpisFromRequests(list);
};

function computeKpisFromRequests(requests) {
  const byStatus = requests.reduce((acc, r) => { acc[r.status] = (acc[r.status]||0)+1; return acc; }, {});
  const total = requests.length;
  const completed = requests.filter(r => r.completedAt?.seconds);
  const avgLeadTime = completed.length
    ? Math.round(completed.reduce((sum, r)=> sum + ((r.completedAt.seconds - (r.createdAt?.seconds||r.startedAt?.seconds||r.updatedAt?.seconds||r.completedAt.seconds)) / 3600), 0) / completed.length)
    : 0; // em horas
  const cancelled = requests.filter(r => r.status === 'cancelled').length;
  // SLA simples: % completados em <= 48h desde assigned/in_progress
  const inWindow = completed.filter(r => {
    const start = r.startedAt?.seconds || r.updatedAt?.seconds || r.createdAt?.seconds || r.completedAt.seconds;
    return (r.completedAt.seconds - start) <= (48*3600);
  }).length;
  const sla48h = completed.length ? Math.round((inWindow / completed.length) * 100) : 0;
  return {
    total,
    byStatus,
    avgLeadTimeHours: avgLeadTime,
    cancelled,
    sla48h
  };
}

// ===== Central de Aprovações =====
export const listProfileApprovals = async () => {
  if (isDev()) return mockPersistence.getProfileChangeRequests('pending');
  const q = query(collection(db, 'profileChangeRequests'), where('status','==','pending'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
};

export const listServiceApprovals = async () => {
  if (isDev()) return [];
  const q = query(collection(db, 'serviceChangeRequests'), where('status','==','pending'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
};

export const approveServiceChange = async (id) => {
  if (isDev()) return true;
  const ref = doc(db, 'serviceChangeRequests', id);
  await updateDoc(ref, { status: 'approved', updatedAt: serverTimestamp() });
  return true;
};

export const rejectServiceChange = async (id, reason='') => {
  if (isDev()) return true;
  const ref = doc(db, 'serviceChangeRequests', id);
  await updateDoc(ref, { status: 'rejected', rejectionReason: reason, updatedAt: serverTimestamp() });
  return true;
};

// ===== Estoque / Insumos =====
export const getInventory = async () => {
  if (isDev()) return [];
  const snap = await getDocs(collection(db, 'inventoryItems'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
};

export const addInventoryItem = async (item) => {
  if (isDev()) return { id: `mock-${Date.now()}`, ...item };
  const ref = await addDoc(collection(db, 'inventoryItems'), { ...item, updatedAt: serverTimestamp(), createdAt: serverTimestamp() });
  return { id: ref.id, ...item };
};

export const updateInventoryItem = async (id, item) => {
  if (isDev()) return true;
  await updateDoc(doc(db, 'inventoryItems', id), { ...item, updatedAt: serverTimestamp() });
  return true;
};

export const deleteInventoryItem = async (id) => {
  if (isDev()) return true;
  await deleteDoc(doc(db, 'inventoryItems', id));
  return true;
};

export const getReservations = async () => {
  if (isDev()) return [];
  const snap = await getDocs(collection(db, 'inventoryReservations'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
};

export const reserveForService = async ({ serviceRequestId, itemId, quantity }) => {
  if (isDev()) return { id: `mock-${Date.now()}`, serviceRequestId, itemId, quantity };
  // Baixa no estoque e cria reserva
  const itemRef = doc(db, 'inventoryItems', itemId);
  const resRef = await addDoc(collection(db, 'inventoryReservations'), { serviceRequestId, itemId, quantity, status: 'reserved', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await updateDoc(itemRef, { stock: (quantity ? undefined : undefined), updatedAt: serverTimestamp() });
  return { id: resRef.id };
};

export const consumeReservation = async (reservationId) => {
  if (isDev()) return true;
  await updateDoc(doc(db, 'inventoryReservations', reservationId), { status: 'consumed', updatedAt: serverTimestamp() });
  return true;
};

// ===== Tabelas de preço =====
export const getPriceTables = async () => {
  if (isDev()) return [];
  const snap = await getDocs(collection(db, 'priceTables'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
};

export const addPriceTable = async (table) => {
  if (isDev()) return { id: `mock-${Date.now()}`, ...table };
  const ref = await addDoc(collection(db, 'priceTables'), { ...table, updatedAt: serverTimestamp(), createdAt: serverTimestamp() });
  return { id: ref.id, ...table };
};

export const updatePriceTable = async (id, table) => {
  if (isDev()) return true;
  await updateDoc(doc(db, 'priceTables', id), { ...table, updatedAt: serverTimestamp() });
  return true;
};

export const deletePriceTable = async (id) => {
  if (isDev()) return true;
  await deleteDoc(doc(db, 'priceTables', id));
  return true;
};

// ===== Templates de serviço (por região/complexidade) =====
export const getServiceTemplates = async () => {
  if (isDev()) return [];
  const snap = await getDocs(collection(db, 'serviceTemplates'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
};

export const addServiceTemplate = async (tpl) => {
  if (isDev()) return { id: `mock-${Date.now()}`, ...tpl };
  const ref = await addDoc(collection(db, 'serviceTemplates'), { ...tpl, updatedAt: serverTimestamp(), createdAt: serverTimestamp() });
  return { id: ref.id, ...tpl };
};

export const updateServiceTemplate = async (id, tpl) => {
  if (isDev()) return true;
  await updateDoc(doc(db, 'serviceTemplates', id), { ...tpl, updatedAt: serverTimestamp() });
  return true;
};

export const deleteServiceTemplate = async (id) => {
  if (isDev()) return true;
  await deleteDoc(doc(db, 'serviceTemplates', id));
  return true;
};

// ===== Campos personalizados por tipo de serviço =====
export const getServiceFieldDefs = async (serviceType) => {
  if (isDev()) return [];
  const snap = await getDocs(collection(db, 'serviceFieldDefs', serviceType, 'fields'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
};

export const addServiceFieldDef = async (serviceType, field) => {
  if (isDev()) return { id: `mock-${Date.now()}`, ...field };
  const ref = await addDoc(collection(db, 'serviceFieldDefs', serviceType, 'fields'), { ...field, updatedAt: serverTimestamp(), createdAt: serverTimestamp() });
  return { id: ref.id, ...field };
};

export const updateServiceFieldDef = async (serviceType, fieldId, field) => {
  if (isDev()) return true;
  await updateDoc(doc(db, 'serviceFieldDefs', serviceType, 'fields', fieldId), { ...field, updatedAt: serverTimestamp() });
  return true;
};

export const deleteServiceFieldDef = async (serviceType, fieldId) => {
  if (isDev()) return true;
  await deleteDoc(doc(db, 'serviceFieldDefs', serviceType, 'fields', fieldId));
  return true;
};


