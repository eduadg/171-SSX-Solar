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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Tipo de produto
export const PRODUCT_TYPES = {
  SOLAR_HEATER: 'solar_heater',
  GAS_HEATER: 'gas_heater',
  ACCESSORY: 'accessory',
  SERVICE: 'service',
};

// Criar um novo produto
export const createProduct = async (productData, imageFile = null) => {
  try {
    let imageUrl = null;
    
    // Upload da imagem se fornecida
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    // Criar documento do produto no Firestore
    const productRef = await addDoc(collection(db, 'products'), {
      ...productData,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return { id: productRef.id, ...productData, imageUrl };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Obter todos os produtos
export const getAllProducts = async () => {
  try {
    const q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Obter produtos por tipo
export const getProductsByType = async (productType) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('type', '==', productType),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products by type:', error);
    throw error;
  }
};

// Obter um produto pelo ID
export const getProductById = async (productId) => {
  try {
    const productDocRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productDocRef);
    
    if (productDoc.exists()) {
      return {
        id: productDoc.id,
        ...productDoc.data()
      };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Atualizar um produto existente
export const updateProduct = async (productId, productData, imageFile = null) => {
  try {
    let updateData = { ...productData };
    
    // Upload da nova imagem se fornecida
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      updateData.imageUrl = await getDownloadURL(storageRef);
    }
    
    updateData.updatedAt = serverTimestamp();
    
    const productDocRef = doc(db, 'products', productId);
    await updateDoc(productDocRef, updateData);
    
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Excluir um produto
export const deleteProduct = async (productId) => {
  try {
    const productDocRef = doc(db, 'products', productId);
    await deleteDoc(productDocRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}; 