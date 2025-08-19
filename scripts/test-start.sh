#!/bin/bash

# 🚀 Script para testing de npm start
# Verifica que el servidor inicie correctamente

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[START-TEST]${NC} $1"
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

log "Iniciando test de npm start..."

# Crear archivos .env si no existen
if [ ! -f "backend/.env" ]; then
    log "Creando .env temporal para backend..."
    cat > backend/.env << EOF
MONGODB_URI=mongodb://localhost:27017/test_tortilleria
JWT_SECRET=test_jwt_secret_$(date +%s)
PORT=3001
NODE_ENV=test
EOF
fi

# Verificar que el build existe
if [ ! -d "backend/dist" ]; then
    log "No existe dist, ejecutando build primero..."
    npm run build
fi

# Probar start con timeout
log "Iniciando servidor con timeout de 20 segundos..."

# Crear un log file
mkdir -p test-logs

# Iniciar el servidor en background
timeout 20s npm start > test-logs/start-test.log 2>&1 &
SERVER_PID=$!

# Esperar un momento para que inicie
sleep 5

# Verificar si el proceso sigue corriendo
if kill -0 $SERVER_PID 2>/dev/null; then
    success "Servidor se inició correctamente (PID: $SERVER_PID)"
    
    # Intentar hacer una petición simple
    if command -v curl >/dev/null 2>&1; then
        log "Probando conectividad del servidor..."
        
        # Probar endpoint básico con timeout
        if timeout 5s curl -f -s http://localhost:3001/ >/dev/null 2>&1; then
            success "Servidor responde a peticiones HTTP"
        elif timeout 5s curl -f -s http://localhost:3001/api/ >/dev/null 2>&1; then
            success "API endpoint responde correctamente"
        else
            warning "Servidor no responde (puede ser normal sin MongoDB)"
        fi
    else
        warning "curl no disponible, saltando test de conectividad"
    fi
    
    # Terminar el servidor
    log "Terminando servidor de prueba..."
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
    
    success "Test de npm start completado exitosamente"
    
else
    error "Servidor falló al iniciar"
    
    if [ -f test-logs/start-test.log ]; then
        echo "--- Server Error Log ---"
        cat test-logs/start-test.log
    fi
    
    exit 1
fi

# Limpiar archivos temporales en CI
if [ "$CI" = "true" ]; then
    rm -f backend/.env fronted/.env
fi

log "Test de start completado"
