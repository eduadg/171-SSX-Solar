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

// Categorias de produtos
export const PRODUCT_CATEGORIES = {
  HEATING: 'heating',
  ACCESSORIES: 'accessories',
  PARTS: 'parts',
};

// 🔧 DETECÇÃO DE MODO DESENVOLVIMENTO
const isDevelopmentMode = () => {
  // Modo desenvolvimento se:
  // 1. Não tem arquivo .env.local (sem VITE_FIREBASE_API_KEY)
  // 2. Ou se estiver explicitamente em modo development
  const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                           import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY';
  
  // Se não tem configuração Firebase válida, está em modo desenvolvimento
  return !hasFirebaseConfig;
};

// 📊 DADOS MOCK DE PRODUTOS
const mockProducts = [
  {
    id: 'prod-001',
    name: 'Aquecedor Solar Premium 200L',
    type: PRODUCT_TYPES.SOLAR_HEATER,
    category: PRODUCT_CATEGORIES.HEATING,
    price: 2500.00,
    description: 'Aquecedor solar de alta eficiência com reservatório térmico de 200 litros. Ideal para famílias de 3-4 pessoas.',
    capacity: '200L',
    warranty: '5 anos',
    brand: 'SolarTech',
    model: 'ST-200P',
    inStock: true,
    stockQuantity: 15,
    image: 'https://picsum.photos/400/300?random=1',
    specifications: {
      dimensions: '2.10m x 1.20m x 0.10m',
      weight: '45kg',
      material: 'Aço inoxidável',
      efficiency: '95%'
    },
    createdAt: { seconds: Math.floor(Date.now()/1000) - 2592000 }, // 30 dias atrás
    updatedAt: { seconds: Math.floor(Date.now()/1000) - 86400 },
  },
  {
    id: 'prod-002',
    name: 'Aquecedor Solar Compacto 100L',
    type: PRODUCT_TYPES.SOLAR_HEATER,
    category: PRODUCT_CATEGORIES.HEATING,
    price: 1800.00,
    description: 'Aquecedor solar compacto para apartamentos e casas pequenas. Economia garantida na conta de energia.',
    capacity: '100L',
    warranty: '3 anos',
    brand: 'EcoSolar',
    model: 'EC-100C',
    inStock: true,
    stockQuantity: 8,
    image: 'https://picsum.photos/400/300?random=2',
    specifications: {
      dimensions: '1.60m x 1.00m x 0.08m',
      weight: '28kg',
      material: 'Alumínio anodizado',
      efficiency: '90%'
    },
    createdAt: { seconds: Math.floor(Date.now()/1000) - 2160000 }, // 25 dias atrás
    updatedAt: { seconds: Math.floor(Date.now()/1000) - 172800 },
  },
  {
    id: 'prod-003',
    name: 'Aquecedor a Gás Digital 15L',
    type: PRODUCT_TYPES.GAS_HEATER,
    category: PRODUCT_CATEGORIES.HEATING,
    price: 850.00,
    description: 'Aquecedor a gás instantâneo com display digital e controle de temperatura preciso.',
    capacity: '15L/min',
    warranty: '2 anos',
    brand: 'GasFlow',
    model: 'GF-15D',
    inStock: true,
    stockQuantity: 22,
    image: 'https://picsum.photos/400/300?random=3',
    specifications: {
      dimensions: '0.60m x 0.35m x 0.20m',
      weight: '12kg',
      material: 'Aço galvanizado',
      gasType: 'GLP/GN'
    },
    createdAt: { seconds: Math.floor(Date.now()/1000) - 1728000 }, // 20 dias atrás
    updatedAt: { seconds: Math.floor(Date.now()/1000) - 259200 },
  },
  {
    id: 'prod-004',
    name: 'Kit de Instalação Universal',
    type: PRODUCT_TYPES.ACCESSORY,
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    price: 320.00,
    description: 'Kit completo para instalação de aquecedores solares com todas as conexões e acessórios necessários.',
    warranty: '1 ano',
    brand: 'SSX Solar',
    model: 'KIT-UNIV',
    inStock: true,
    stockQuantity: 35,
    image: 'https://picsum.photos/400/300?random=4',
    specifications: {
      includes: 'Tubulações, conexões, válvulas, parafusos',
      material: 'PVC e metais',
      compatibility: 'Todos os modelos'
    },
    createdAt: { seconds: Math.floor(Date.now()/1000) - 1296000 }, // 15 dias atrás
    updatedAt: { seconds: Math.floor(Date.now()/1000) - 43200 },
  },
  {
    id: 'prod-005',
    name: 'Aquecedor Solar Industrial 500L',
    type: PRODUCT_TYPES.SOLAR_HEATER,
    category: PRODUCT_CATEGORIES.HEATING,
    price: 4200.00,
    description: 'Aquecedor solar de grande capacidade para uso comercial e industrial.',
    capacity: '500L',
    warranty: '10 anos',
    brand: 'IndustrialSolar',
    model: 'IS-500I',
    inStock: false,
    stockQuantity: 0,
    image: 'https://picsum.photos/400/300?random=5',
    specifications: {
      dimensions: '3.50m x 2.00m x 0.15m',
      weight: '120kg',
      material: 'Aço inoxidável industrial',
      efficiency: '98%'
    },
    createdAt: { seconds: Math.floor(Date.now()/1000) - 864000 }, // 10 dias atrás
    updatedAt: { seconds: Math.floor(Date.now()/1000) - 86400 },
  }
];

// 🚀 FUNÇÃO COM TIMEOUT E FALLBACK
const withTimeout = async (promise, timeoutMs = 5000) => {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  
  return Promise.race([promise, timeoutPromise]);
};

// Criar um novo produto
export const createProduct = async (productData, imageFile = null) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Criando produto mock:', productData);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockId = `mock-prod-${Date.now()}`;
    return {
      id: mockId,
      ...productData,
      createdAt: { seconds: Math.floor(Date.now()/1000) },
      updatedAt: { seconds: Math.floor(Date.now()/1000) },
    };
  }

  try {
    let imageUrl = null;
    
    // Upload da imagem se fornecida
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    return await withTimeout(async () => {
      // Criar documento do produto no Firestore
      const productRef = await addDoc(collection(db, 'products'), {
        ...productData,
        imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return { id: productRef.id, ...productData, imageUrl };
    });
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Obter todos os produtos
export const getAllProducts = async () => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Retornando produtos mock');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`📦 [DEV MODE] Total de ${mockProducts.length} produtos mock`);
    return mockProducts;
  }

  // Verificação adicional de segurança
  if (!db || typeof db !== 'object') {
    console.warn('⚠️ [PRODUCTS] Database não disponível, usando dados mock como fallback');
    return mockProducts;
  }

  try {
    return await withTimeout(async () => {
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
    });
  } catch (error) {
    console.error('Error getting products:', error);
    // Fallback para dados mock em qualquer erro
    console.warn('⚠️ Firebase erro, usando dados mock como fallback');
    return mockProducts;
  }
};

// Obter produtos por tipo
export const getProductsByType = async (productType) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Buscando produtos mock por tipo:', productType);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const filteredProducts = mockProducts.filter(product => product.type === productType);
    console.log(`🔧 [DEV MODE] Encontrados ${filteredProducts.length} produtos do tipo ${productType}`);
    return filteredProducts;
  }

  // Verificação adicional de segurança
  if (!db || typeof db !== 'object') {
    console.warn('⚠️ [PRODUCTS] Database não disponível, usando dados mock como fallback');
    const filteredProducts = mockProducts.filter(product => product.type === productType);
    return filteredProducts;
  }

  try {
    return await withTimeout(async () => {
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
    });
  } catch (error) {
    console.error('Error getting products by type:', error);
    // Fallback para dados mock em qualquer erro
    console.warn('⚠️ Firebase erro, usando dados mock como fallback');
    return mockProducts.filter(product => product.type === productType);
  }
};

// Obter um produto pelo ID
export const getProductById = async (productId) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Buscando produto mock por ID:', productId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockProduct = mockProducts.find(product => product.id === productId);
    if (mockProduct) {
      return mockProduct;
    } else {
      throw new Error('Product not found');
    }
  }

  try {
    return await withTimeout(async () => {
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
    });
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Atualizar um produto existente
export const updateProduct = async (productId, productData, imageFile = null) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Atualizando produto mock:', { productId, productData });
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  }

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
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Excluindo produto mock:', productId);
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  }

  try {
    return await withTimeout(async () => {
      const productDocRef = doc(db, 'products', productId);
      await deleteDoc(productDocRef);
      
      return true;
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Fazer upload de imagem do produto
export const uploadProductImage = async (productId, file) => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Upload mock de imagem do produto:', { productId, fileName: file?.name });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula upload
    return `https://picsum.photos/400/300?random=${Date.now()}`;
  }

  try {
    return await withTimeout(async () => {
      const storageRef = ref(storage, `products/${productId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Atualizar o produto com a nova imagem
      const productDocRef = doc(db, 'products', productId);
      await updateDoc(productDocRef, {
        imageUrl: downloadURL,
        updatedAt: serverTimestamp(),
      });
      
      return downloadURL;
    }, 10000); // Upload tem timeout maior
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
};

// Atualizar estoque de um produto
export const updateProductStock = async (productId, quantity, operation = 'set') => {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV MODE] Atualizando estoque mock:', { productId, quantity, operation });
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }

  try {
    return await withTimeout(async () => {
      const productDocRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productDocRef);
      
      if (!productDoc.exists()) {
        throw new Error('Product not found');
      }
      
      const currentStock = productDoc.data().stockQuantity || 0;
      let newStock;
      
      switch (operation) {
        case 'add':
          newStock = currentStock + quantity;
          break;
        case 'subtract':
          newStock = Math.max(0, currentStock - quantity);
          break;
        case 'set':
        default:
          newStock = quantity;
          break;
      }
      
      await updateDoc(productDocRef, {
        stockQuantity: newStock,
        inStock: newStock > 0,
        updatedAt: serverTimestamp(),
      });
      
      return true;
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
}; 