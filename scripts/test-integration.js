#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

function log(message, color = 'blue') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function testIntegration() {
  try {
    logInfo('🧪 Probando script de integración...');
    
    // Verificar que el script existe
    const scriptPath = path.join(__dirname, 'integration-test.js');
    if (!fs.existsSync(scriptPath)) {
      throw new Error('Script integration-test.js no encontrado');
    }
    logSuccess('Script integration-test.js encontrado');
    
    // Verificar que create-test-order.ts existe
    const createOrderPath = path.join(__dirname, 'create-test-order.ts');
    if (!fs.existsSync(createOrderPath)) {
      throw new Error('Script create-test-order.ts no encontrado');
    }
    logSuccess('Script create-test-order.ts encontrado');
    
    // Verificar que test-data.ts existe
    const testDataPath = path.join(__dirname, '../src/fixtures/test-data.ts');
    if (!fs.existsSync(testDataPath)) {
      throw new Error('Archivo test-data.ts no encontrado');
    }
    logSuccess('Archivo test-data.ts encontrado');
    
    // Verificar que tsx está disponible
    try {
      execSync('npx tsx --version', { stdio: 'pipe' });
      logSuccess('tsx está disponible');
    } catch (error) {
      logError('tsx no está disponible. Ejecuta: npm install');
      throw error;
    }
    
    // Verificar que playwright está disponible
    try {
      execSync('npx playwright --version', { stdio: 'pipe' });
      logSuccess('Playwright está disponible');
    } catch (error) {
      logError('Playwright no está disponible. Ejecuta: npm install');
      throw error;
    }
    
    logSuccess('🎉 Todas las dependencias están disponibles');
    logInfo('Puedes ejecutar: npm run integration-test');
    
  } catch (error) {
    logError(`Error en la prueba: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  testIntegration();
}

module.exports = { testIntegration };
