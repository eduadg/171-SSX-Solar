#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Debugando carregamento de produtos...');

// Verificar se .env.local existe
const envLocalPath = path.join(process.cwd(), '.env.local');
const hasEnvLocal = fs.existsSync(envLocalPath);

console.log('📁 Arquivo .env.local existe:', hasEnvLocal);

if (hasEnvLocal) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const hasApiKey = envContent.includes('VITE_FIREBASE_API_KEY');
  const hasValidApiKey = envContent.includes('VITE_FIREBASE_API_KEY') && 
                        !envContent.includes('YOUR_API_KEY');
  
  console.log('🔑 VITE_FIREBASE_API_KEY presente:', hasApiKey);
  console.log('✅ API Key válida:', hasValidApiKey);
  
  if (hasValidApiKey) {
    console.log('🔥 Sistema deve estar usando Firebase real');
  } else {
    console.log('🔧 Sistema deve estar em modo desenvolvimento');
  }
} else {
  console.log('🔧 Sistema em modo desenvolvimento (sem .env.local)');
}

console.log('');
console.log('💡 Para testar produtos:');
console.log('   1. Abra o console do navegador (F12)');
console.log('   2. Vá para a página de solicitar serviço');
console.log('   3. Verifique os logs de carregamento de produtos');
console.log('   4. Se estiver em modo DEV, deve usar produtos mock');
console.log('   5. Se estiver usando Firebase, deve buscar do Firestore');

console.log('');
console.log('📋 Produtos mock disponíveis:');
const mockProducts = [
  { id: 'prod-001', name: 'Aquecedor Solar Premium 200L', type: 'solar_heater', price: 2500.00 },
  { id: 'prod-002', name: 'Aquecedor Solar Compacto 100L', type: 'solar_heater', price: 1800.00 },
  { id: 'prod-003', name: 'Aquecedor a Gás Digital 15L', type: 'gas_heater', price: 850.00 },
  { id: 'prod-004', name: 'Kit de Instalação Universal', type: 'accessory', price: 320.00 },
  { id: 'prod-005', name: 'Aquecedor Solar Industrial 500L', type: 'solar_heater', price: 4200.00 }
];

mockProducts.forEach(product => {
  console.log(`   - ${product.id}: ${product.name} (${product.type}) - R$ ${product.price.toFixed(2)}`);
});

console.log('');
console.log('✅ Debug concluído!'); 