#!/usr/bin/env node

const { delay } = require('./integration-test.js');

// Colores para output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  reset: '\x1b[0m'
};

function log(message, color = 'blue') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function testDelay() {
  logInfo('🧪 Probando función de delay...');
  
  try {
    // Probar delay de 3 segundos
    logInfo('Probando delay de 3 segundos...');
    await delay(3000, 'prueba de delay');
    
    logSuccess('✅ Delay de 3 segundos completado');
    
    // Probar delay de 1 segundo
    logInfo('Probando delay de 1 segundo...');
    await delay(1000, 'prueba rápida');
    
    logSuccess('✅ Delay de 1 segundo completado');
    
    logSuccess('🎉 Todas las pruebas de delay pasaron!');
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
  }
}

if (require.main === module) {
  testDelay();
}

module.exports = { testDelay };
