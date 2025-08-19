#!/bin/bash

# 🏗️ Script específico para testing de build compatibility
# Verifica que el build funcione en diferentes entornos

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[BUILD-TEST]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

log "Iniciando test de compatibilidad de build..."

# Crear .env temporales si no existen
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
MONGODB_URI=mongodb://localhost:27017/test_db
JWT_SECRET=test_secret_key
PORT=3001
NODE_ENV=test
EOF
fi

if [ ! -f "fronted/.env" ]; then
    cat > fronted/.env << EOF
VITE_API_LOGIN=http://localhost:3001/api/login
VITE_API_USER=http://localhost:3001/api/users
VITE_API_AUTH=http://localhost:3001/api/login/auth
VITE_GOOGLE_CLIENT_ID=test_client_id
EOF
fi

# Test de build
log "Ejecutando build..."
npm run build

# Verificar resultados
if [ -d "backend/dist" ]; then
    success "Build completado - directorio dist creado"
    
    # Verificar archivos principales
    if [ -f "backend/dist/index.html" ]; then
        success "index.html encontrado"
    fi
    
    # Contar archivos generados
    file_count=$(find backend/dist -type f | wc -l)
    log "Archivos generados: $file_count"
    
else
    error "Build falló - no se creó directorio dist"
    exit 1
fi

success "Test de build compatibility completado"
