#!/usr/bin/env node

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Adicionando produtos ao Firestore...');

// Dados dos produtos
const products = [
  {
    id: 'solar-001',
    name: 'Aquecedor Solar Residencial 200L',
    type: 'solar_heater',
    price: 2500.00,
    description: 'Aquecedor solar para residências com capacidade de 200 litros',
    features: ['Painel solar', 'Reservatório térmico', 'Instalação simples'],
    inStock: true,
    stockQuantity: 15,
    imageUrl: 'https://picsum.photos/400/300?random=1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'solar-002',
    name: 'Aquecedor Solar Comercial 500L',
    type: 'solar_heater',
    price: 4500.00,
    description: 'Aquecedor solar para uso comercial com capacidade de 500 litros',
    features: ['Painel solar duplo', 'Reservatório grande', 'Alta eficiência'],
    inStock: true,
    stockQuantity: 8,
    imageUrl: 'https://picsum.photos/400/300?random=2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'gas-001',
    name: 'Aquecedor a Gás 6L/min',
    type: 'gas_heater',
    price: 1200.00,
    description: 'Aquecedor a gás com vazão de 6 litros por minuto',
    features: ['Acendimento automático', 'Controle de temperatura', 'Economia de gás'],
    inStock: true,
    stockQuantity: 25,
    imageUrl: 'https://picsum.photos/400/300?random=3',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'gas-002',
    name: 'Aquecedor a Gás 10L/min',
    type: 'gas_heater',
    price: 1800.00,
    description: 'Aquecedor a gás com vazão de 10 litros por minuto',
    features: ['Alta vazão', 'Controle digital', 'Segurança avançada'],
    inStock: true,
    stockQuantity: 12,
    imageUrl: 'https://picsum.photos/400/300?random=4',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function addProductsToFirestore() {
  try {
    // Verificar se o arquivo de credenciais existe
    const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
    if (!fs.existsSync(serviceAccountPath)) {
      console.log('❌ Arquivo serviceAccountKey.json não encontrado!');
      console.log('💡 Para adicionar produtos automaticamente:');
      console.log('   1. Vá para o Firebase Console');
      console.log('   2. Configurações do Projeto > Contas de serviço');
      console.log('   3. Clique em "Gerar nova chave privada"');
      console.log('   4. Salve o arquivo como "serviceAccountKey.json" na raiz do projeto');
      console.log('   5. Execute este script novamente');
      return;
    }

    // Inicializar Firebase Admin
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    const app = initializeApp({
      credential: cert(serviceAccount)
    });
    
    const db = getFirestore(app);
    console.log('✅ Firebase Admin inicializado');

    // Adicionar produtos
    for (const product of products) {
      const { id, ...productData } = product;
      
      await db.collection('products').doc(id).set(productData);
      console.log(`✅ Produto adicionado: ${id} - ${product.name}`);
    }

    console.log('🎉 Todos os produtos foram adicionados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao adicionar produtos:', error);
    console.log('');
    console.log('💡 Alternativa manual:');
    console.log('   1. Vá para o Firebase Console');
    console.log('   2. Navegue para Firestore Database');
    console.log('   3. Crie uma coleção chamada "products"');
    console.log('   4. Adicione os documentos manualmente');
  }
}

addProductsToFirestore(); 