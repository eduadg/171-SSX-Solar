#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Criando produtos de exemplo no Firestore...');

// Dados dos produtos de exemplo
const sampleProducts = [
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

// Criar arquivo temporário com os dados
const tempDataFile = path.join(process.cwd(), 'temp-products-data.json');
fs.writeFileSync(tempDataFile, JSON.stringify(sampleProducts, null, 2));

console.log('📝 Dados dos produtos criados em:', tempDataFile);
console.log('💡 Para adicionar os produtos ao Firestore:');
console.log('   1. Vá para o Firebase Console');
console.log('   2. Navegue para Firestore Database');
console.log('   3. Crie uma coleção chamada "products"');
console.log('   4. Adicione os documentos com os IDs e dados dos produtos');
console.log('');
console.log('📋 Produtos para adicionar:');
sampleProducts.forEach(product => {
  console.log(`   - ID: ${product.id}`);
  console.log(`     Nome: ${product.name}`);
  console.log(`     Tipo: ${product.type}`);
  console.log(`     Preço: R$ ${product.price.toFixed(2)}`);
  console.log('');
});

console.log('✅ Script concluído!'); 