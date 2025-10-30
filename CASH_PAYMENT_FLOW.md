# Cash Payment Flow - Walgreens Barcode Generation

Este documento describe la implementación del flujo de pago en efectivo usando códigos de barras de Walgreens, desarrollado usando MCP Playwright para grabar acciones y locators.

## 🎯 Objetivo

Implementar un flujo completo de pago en efectivo que permite:
1. **Generar una nueva orden de Overseer** para cada ejecución
2. Cambiar método de pago a efectivo en tienda
3. Seleccionar Walgreens como tienda
4. Generar código de barras de 30 caracteres
5. Validar todos los elementos requeridos

### **🔄 Independencia de Órdenes:**
- **`combined-payment-scenarios`**: Usa órdenes generadas por `create-test-order.ts`
- **`cash-payment-flow`**: Usa órdenes generadas por `create-cash-payment-order.ts`
- **Separación completa**: Cada flujo tiene su propia generación de órdenes
- **Sin conflictos**: Los tests pueden ejecutarse independientemente

## 📋 Flujo Implementado

### Pasos del Flujo:
1. **Navegación inicial** - Ir a la página de revisión de pago
2. **Cambiar método de pago** - Hacer clic en "Cambiar" junto a los últimos 4 dígitos
3. **Scroll al final** - Ver todas las opciones de pago
4. **Seleccionar efectivo en tienda** - Hacer clic en "Pagar con efectivo en tienda"
5. **Seleccionar Walgreens** - Elegir la primera opción de tienda
6. **Generar código de barras** - Hacer clic en "Crear código de barras"
7. **Validar elementos** - Verificar todos los elementos requeridos

### Validaciones Implementadas:
- ✅ "Enseña este código" en cabecera del DOM
- ✅ Código de 30 caracteres de longitud
- ✅ Leyenda final completa
- ✅ Logo de Walgreens visible
- ✅ Instrucciones presentes

## 🏗️ Arquitectura del POM

### Archivos Modificados:
- **`base-page.ts`** - Extendido con métodos genéricos para scroll y validaciones
- **`payment-review-page.ts`** - Agregados métodos específicos para efectivo

### Archivos Nuevos:
- **`cash-payment-page.ts`** - Maneja selección de tiendas
- **`barcode-generation-page.ts`** - Maneja generación y validación de códigos
- **`cash-payment-flow.spec.ts`** - Tests del flujo completo

## 🚀 Uso

### Comandos Disponibles:

#### **Comandos Integrados (Recomendados):**
```bash
# Flujo completo: Generar orden + Ejecutar tests (headless)
npm run cash-payment-flow

# Flujo completo: Generar orden + Ejecutar tests (con navegador visible)
npm run cash-payment-flow:headed

# Flujo completo: Generar orden + Ejecutar tests (modo debug)
npm run cash-payment-flow:debug
```

#### **Comandos de Tests Solos (Requieren orden previa):**
```bash
# Ejecutar tests en modo headless
npm run test:cash-payment

# Ejecutar tests con navegador visible
npm run test:cash-payment:headed

# Ejecutar tests en modo debug
npm run test:cash-payment:debug

# Ejecutar tests con UI de Playwright
npm run test:cash-payment:ui

# Ejecutar tests solo en Chrome
npm run test:cash-payment:chrome
```

#### **Comandos de Generación de Órdenes:**
```bash
# Generar solo una orden para efectivo
npm run create-cash-order

# Generar orden para combined-payment-scenarios
npm run create-order
```

### Scripts de Integración:

```bash
# Script completo de integración (genera orden + ejecuta tests)
node scripts/cash-payment-integration.js

# Script de validación solo (requiere orden previa)
node scripts/test-cash-payment.js test:cash-payment
```

## 📊 Locators Identificados

### Payment Review Page:
```typescript
changePaymentMethodLink: page.getByRole('link', { name: 'Cambiar' })
createBarcodeButton: page.getByRole('button', { name: 'Crear código de barras' })
cashPaymentMethod: page.locator('img[alt="Walgreens"]').locator('..')
```

### Cash Payment Page:
```typescript
walgreensOption: page.getByText('Walgreens Min: $20 - Max: $500 $')
cashPaymentButton: page.getByRole('button', { name: 'Pagar con efectivo en tienda' })
```

### Barcode Generation Page:
```typescript
headerText: page.getByRole('heading', { name: 'Enseña este código' })
barcodeCode: page.locator('generic').filter({ hasText: /^\d{30}$/ })
finalLegend: page.locator('p:has-text("Toma una captura para tener el código a la mano...")')
```

## 🔧 Métodos Implementados

### BasePage (Extendido):
- `scrollToBottom()` - Scroll hasta el final de la página
- `validateTextInHeader()` - Validar texto en cabecera
- `validateCodeLength()` - Validar longitud de código

### PaymentReviewPage (Extendido):
- `clickChangePaymentMethod()` - Cambiar método de pago
- `clickCreateBarcode()` - Crear código de barras
- `validateCashPaymentMethod()` - Validar método de efectivo

### CashPaymentPage (Nuevo):
- `selectWalgreens()` - Seleccionar Walgreens
- `validateStoreOptionsAvailable()` - Validar opciones de tiendas
- `clickCashPaymentInStore()` - Seleccionar efectivo en tienda

### BarcodeGenerationPage (Nuevo):
- `waitForBarcodeGeneration()` - Esperar generación de código
- `validateCodeLength()` - Validar longitud de código
- `validateHeaderText()` - Validar texto de cabecera
- `validateFinalLegend()` - Validar leyenda final

## 🧪 Tests Implementados

### 1. Test Principal - Flujo Completo:
- Ejecuta todo el flujo paso a paso
- Valida cada elemento requerido
- Genera código de barras y valida formato

### 2. Test de Validación de Tiendas:
- Valida que todas las opciones de tiendas estén disponibles
- Verifica visibilidad de cada tienda

### 3. Test de Validación de Código:
- Valida elementos específicos del código de barras
- Verifica formato y longitud del código

## 📸 Screenshots Automáticos

El framework toma screenshots automáticamente en cada paso:
- `payment-review-page.png` - Página inicial
- `store-selection-page.png` - Selección de tiendas
- `barcode-generation-page.png` - Página de código de barras
- `barcode-code-generated.png` - Código generado

## 🔍 Validaciones Implementadas

### Validaciones de Contenido:
- ✅ Texto "Enseña este código" en cabecera
- ✅ Código de exactamente 30 caracteres
- ✅ Leyenda completa presente
- ✅ Logo de Walgreens visible

### Validaciones de Funcionalidad:
- ✅ Navegación entre páginas
- ✅ Selección de opciones
- ✅ Generación de código
- ✅ Elementos interactivos

### Validaciones de URL:
- ✅ Patrones de URL correctos
- ✅ Redirecciones apropiadas
- ✅ Estados de página válidos

## 🎉 Resultados Esperados

Al ejecutar el flujo completo, se debe obtener:
- **Código generado**: 30 caracteres numéricos
- **Cabecera**: "Enseña este código"
- **Leyenda**: "Toma una captura para tener el código a la mano. Recuerda que siempre puedes crear uno nuevo."
- **Logo**: Walgreens visible
- **Instrucciones**: Lista completa de pasos

## 🔧 Mantenimiento

### Para Actualizar Locators:
1. Ejecutar MCP Playwright para grabar nuevas acciones
2. Actualizar locators en las páginas correspondientes
3. Ejecutar tests para validar cambios

### Para Agregar Nuevas Tiendas:
1. Agregar locators en `CashPaymentPage`
2. Implementar métodos de selección
3. Actualizar tests de validación

## 📝 Notas de Implementación

- **Reutilización**: Se reutilizaron métodos existentes de `BasePage` y `PaymentReviewPage`
- **Extensibilidad**: Arquitectura permite agregar nuevas tiendas fácilmente
- **Mantenibilidad**: Separación clara de responsabilidades por página
- **Robustez**: Validaciones múltiples y manejo de errores
- **Documentación**: Código bien documentado y comentado

---

**Desarrollado usando MCP Playwright para grabación automática de acciones y locators.**
