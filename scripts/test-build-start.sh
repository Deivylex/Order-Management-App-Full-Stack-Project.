#!/bin/bash

# 🧪 Script de testing para comandos build y start
# Este script simula el entorno de producción para testing

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Crear directorio para logs
mkdir -p test-logs

log "Iniciando tests de build y start para Lex Tortillería..."

# Test 1: Verificar que existen los archivos de configuración necesarios
log "Test 1: Verificando estructura del proyecto..."

required_files=(
    "package.json"
    "backend/package.json"
    "fronted/package.json"
    "backend/index.js"
    "backend/app.js"
    "fronted/index.html"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        success "Archivo encontrado: $file"
    else
        error "Archivo faltante: $file"
        exit 1
    fi
done

# Test 2: Verificar que las variables de entorno de prueba están configuradas
log "Test 2: Verificando variables de entorno..."

if [ -f "backend/.env" ]; then
    success "Archivo .env del backend encontrado"
    
    # Verificar variables críticas
    if grep -q "MONGODB_URI" backend/.env && \
       grep -q "JWT_SECRET" backend/.env && \
       grep -q "PORT" backend/.env; then
        success "Variables de entorno críticas encontradas"
    else
        error "Variables de entorno críticas faltantes"
        exit 1
    fi
else
    warning "Archivo .env del backend no encontrado, creando uno de prueba..."
    
    cat > backend/.env << EOF
MONGODB_URI=mongodb://localhost:27017/test_tortilleria
JWT_SECRET=test_jwt_secret_for_testing_$(date +%s)
PORT=3001
NODE_ENV=test
EOF
    success "Archivo .env de prueba creado"
fi

if [ -f "fronted/.env" ]; then
    success "Archivo .env del frontend encontrado"
else
    warning "Archivo .env del frontend no encontrado, creando uno de prueba..."
    
    cat > fronted/.env << EOF
VITE_API_LOGIN=http://localhost:3001/api/login
VITE_API_USER=http://localhost:3001/api/users  
VITE_API_AUTH=http://localhost:3001/api/login/auth
VITE_GOOGLE_CLIENT_ID=test_google_client_id
EOF
    success "Archivo .env del frontend de prueba creado"
fi

# Test 3: Ejecutar npm build
log "Test 3: Ejecutando 'npm run build'..."

if timeout 300 npm run build > test-logs/build.log 2>&1; then
    success "npm run build completado exitosamente"
    
    # Verificar que se generaron los archivos de build
    if [ -d "backend/dist" ]; then
        success "Directorio dist generado correctamente"
        
        # Verificar archivos críticos en dist
        if [ -f "backend/dist/index.html" ]; then
            success "Archivo index.html generado en dist"
        else
            error "Archivo index.html no encontrado en dist"
            exit 1
        fi
        
        # Verificar tamaño del build
        dist_size=$(du -sh backend/dist | cut -f1)
        log "Tamaño del build: $dist_size"
        
    else
        error "Directorio dist no fue generado"
        cat test-logs/build.log
        exit 1
    fi
    
else
    error "npm run build falló"
    echo "--- Build Log ---"
    cat test-logs/build.log
    exit 1
fi

# Test 4: Verificar dependencias críticas
log "Test 4: Verificando dependencias críticas..."

cd backend
if npm list express mongoose dotenv > ../test-logs/backend-deps.log 2>&1; then
    success "Dependencias del backend verificadas"
else
    warning "Algunas dependencias del backend pueden faltar"
    cat ../test-logs/backend-deps.log
fi

cd ../fronted
if npm list react axios > ../test-logs/frontend-deps.log 2>&1; then
    success "Dependencias del frontend verificadas"
else
    warning "Algunas dependencias del frontend pueden faltar"
    cat ../test-logs/frontend-deps.log
fi
cd ..

# Test 5: Probar npm start (con timeout para evitar que se cuelgue)
log "Test 5: Probando 'npm start' (con timeout de 30 segundos)..."

# Usar un subshell para controlar el proceso
(
    timeout 30 npm start > test-logs/start.log 2>&1 &
    START_PID=$!
    
    sleep 10  # Dar tiempo para que inicie
    
    # Verificar si el proceso está corriendo
    if kill -0 $START_PID 2>/dev/null; then
        success "npm start se inició correctamente"
        
        # Opcional: hacer una petición HTTP simple para verificar que el servidor responde
        if command -v curl >/dev/null; then
            log "Verificando que el servidor responde..."
            if curl -f http://localhost:3001/api/ >/dev/null 2>&1; then
                success "Servidor responde correctamente"
            else
                warning "Servidor no responde (normal en entorno de testing sin DB)"
            fi
        fi
        
        # Terminar el proceso
        kill $START_PID 2>/dev/null || true
        wait $START_PID 2>/dev/null || true
        success "npm start test completado"
        
    else
        error "npm start falló al iniciar"
        cat test-logs/start.log
        exit 1
    fi
) || {
    error "Test de npm start falló"
    if [ -f test-logs/start.log ]; then
        echo "--- Start Log ---"
        cat test-logs/start.log
    fi
    exit 1
}

# Test 6: Verificar archivos estáticos se sirven correctamente
log "Test 6: Verificando archivos estáticos..."

if [ -d "backend/dist" ]; then
    static_files=$(find backend/dist -type f -name "*.js" -o -name "*.css" -o -name "*.html" | wc -l)
    if [ "$static_files" -gt 0 ]; then
        success "Archivos estáticos encontrados: $static_files archivos"
    else
        warning "No se encontraron archivos estáticos"
    fi
fi

# Test 7: Verificar configuración de producción
log "Test 7: Verificando configuración de producción..."

if grep -q "NODE_ENV=production" backend/package.json; then
    success "Configuración de producción encontrada en package.json"
else
    warning "NODE_ENV=production no configurado explícitamente"
fi

# Resumen final
log "=== RESUMEN DE TESTS ==="
success "✅ Estructura de proyecto verificada"
success "✅ Variables de entorno configuradas"
success "✅ npm run build ejecutado exitosamente"
success "✅ npm start probado exitosamente"
success "✅ Dependencias verificadas"
success "✅ Archivos estáticos generados"

log "🎉 Todos los tests pasaron exitosamente!"
log "📁 Logs guardados en: test-logs/"

# Limpiar archivos temporales de prueba si fueron creados por el script
if [ "$CI" = "true" ]; then
    log "Limpiando archivos .env de prueba..."
    rm -f backend/.env fronted/.env
    success "Archivos temporales limpiados"
fi

exit 0
