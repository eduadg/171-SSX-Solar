#!/usr/bin/env node

console.log('🧪 Testando carregamento de produtos...');

// Simular os produtos mock
const PRODUCT_TYPES = {
  SOLAR_HEATER: 'solar_heater',
  GAS_HEATER: 'gas_heater',
  ACCESSORY: 'accessory',
  SERVICE: 'service',
};

const mockProducts = [
  {
    id: 'prod-001',
    name: 'Aquecedor Solar Premium 200L',
    type: PRODUCT_TYPES.SOLAR_HEATER,
    price: 2500.00,
  },
  {
    id: 'prod-002',
    name: 'Aquecedor Solar Compacto 100L',
    type: PRODUCT_TYPES.SOLAR_HEATER,
    price: 1800.00,
  },
  {
    id: 'prod-003',
    name: 'Aquecedor a Gás Digital 15L',
    type: PRODUCT_TYPES.GAS_HEATER,
    price: 850.00,
  },
  {
    id: 'prod-004',
    name: 'Kit de Instalação Universal',
    type: PRODUCT_TYPES.ACCESSORY,
    price: 320.00,
  },
  {
    id: 'prod-005',
    name: 'Aquecedor Solar Industrial 500L',
    type: PRODUCT_TYPES.SOLAR_HEATER,
    price: 4200.00,
  }
];

// Testar filtros
console.log('📋 Todos os produtos:');
mockProducts.forEach(p => console.log(`   - ${p.id}: ${p.name} (${p.type})`));

console.log('\n🔥 Produtos solar_heater:');
const solarProducts = mockProducts.filter(p => p.type === 'solar_heater');
solarProducts.forEach(p => console.log(`   - ${p.id}: ${p.name} - R$ ${p.price.toFixed(2)}`));

console.log('\n🔥 Produtos gas_heater:');
const gasProducts = mockProducts.filter(p => p.type === 'gas_heater');
gasProducts.forEach(p => console.log(`   - ${p.id}: ${p.name} - R$ ${p.price.toFixed(2)}`));

console.log('\n✅ Teste concluído!');
console.log('💡 Agora teste no navegador:');
console.log('   1. Abra o console (F12)');
console.log('   2. Vá para "Solicitar Serviço"');
console.log('   3. Verifique se os produtos aparecem no dropdown'); 