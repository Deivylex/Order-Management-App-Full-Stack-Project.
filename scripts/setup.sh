#!/bin/bash

# 🚀 Script de configuración inicial para el proyecto Lex Tortillería
# Automatiza la configuración del entorno de desarrollo

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "🌮 ========================================"
echo "   LEX TORTILLERÍA - SETUP INICIAL"
echo "========================================"
echo -e "${NC}"

# Función para logging
log() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Verificar Node.js
log "Verificando Node.js..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    success "Node.js encontrado: $NODE_VERSION"
else
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi

# 2. Instalar dependencias
log "Instalando todas las dependencias..."
npm run install:all
success "Dependencias instaladas correctamente"

# 3. Configurar variables de entorno
log "Configurando variables de entorno..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    log "Creando backend/.env desde template..."
    cp backend/.env.example backend/.env
    success "backend/.env creado"
    warning "📝 Edita backend/.env con tus valores reales de MongoDB y JWT"
else
    success "backend/.env ya existe"
fi

# Frontend .env
if [ ! -f "fronted/.env" ]; then
    log "Creando fronted/.env desde template..."
    cp fronted/.env.example fronted/.env
    success "fronted/.env creado"
    warning "📝 Edita fronted/.env con tu Google Client ID si usas OAuth"
else
    success "fronted/.env ya existe"
fi

# 4. Verificar estructura del proyecto
log "Verificando estructura del proyecto..."
required_dirs=("backend" "fronted" "scripts" ".github/workflows")
for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        success "Directorio $dir existe"
    else
        warning "Directorio $dir no encontrado"
    fi
done

# 5. Hacer scripts ejecutables
log "Configurando permisos de scripts..."
chmod +x scripts/*.sh
success "Scripts configurados como ejecutables"

# 6. Probar configuración
log "Probando configuración con tests básicos..."
if ./scripts/test-build-start.sh >/dev/null 2>&1; then
    success "Tests básicos pasaron correctamente"
else
    warning "Algunos tests fallaron - revisa la configuración"
fi

# 7. Información final
echo -e "${GREEN}"
echo "🎉 ================================"
echo "   SETUP COMPLETADO"
echo "================================"
echo -e "${NC}"

echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. 📝 Editar variables de entorno:"
echo "   - backend/.env (MongoDB URI, JWT Secret)"
echo "   - fronted/.env (Google Client ID)"
echo ""
echo "2. 🚀 Iniciar desarrollo:"
echo "   npm run dev"
echo ""
echo "3. 🧪 Probar antes de commit:"
echo "   npm test"
echo ""
echo "4. 📖 Leer documentación:"
echo "   - README.md (guía completa)"
echo "   - TESTING.md (sistema de testing)"
echo "   - docs/TESTING-GUIDE.md (guía rápida)"
echo ""

echo "🌮 ¡Listo para desarrollar en Lex Tortillería! 🌮"
