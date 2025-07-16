#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Aplicando índices do Firestore...');

try {
  // Verificar se firebase.json existe
  const firebaseConfigPath = path.join(process.cwd(), 'firebase.json');
  if (!fs.existsSync(firebaseConfigPath)) {
    console.log('📝 Criando firebase.json...');
    const firebaseConfig = {
      "firestore": {
        "rules": "firestore.rules",
        "indexes": "firestore.indexes.json"
      }
    };
    fs.writeFileSync(firebaseConfigPath, JSON.stringify(firebaseConfig, null, 2));
  }

  // Aplicar índices
  console.log('📊 Aplicando índices...');
  execSync('firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('✅ Índices aplicados com sucesso!');
  
} catch (error) {
  console.error('❌ Erro ao aplicar índices:', error.message);
  console.log('💡 Certifique-se de que:');
  console.log('   1. Firebase CLI está instalado');
  console.log('   2. Você está logado no Firebase');
  console.log('   3. O projeto está configurado corretamente');
} 