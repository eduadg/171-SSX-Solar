#!/bin/bash
# 🔧 Script para alternar entre modo desenvolvimento e produção

FIREBASE_CONFIG="firebase-config.env"
ENV_LOCAL=".env.local"

if [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    # Ativar modo produção
    if [ -f "$FIREBASE_CONFIG" ]; then
        cp "$FIREBASE_CONFIG" "$ENV_LOCAL"
        echo "🔥 Modo PRODUÇÃO ativado!"
        echo "✅ Arquivo .env.local criado com credenciais reais"
        echo "⚠️  CUIDADO: Agora você está usando Firebase real!"
    else
        echo "❌ Erro: arquivo firebase-config.env não encontrado"
        exit 1
    fi
elif [ "$1" = "dev" ] || [ "$1" = "development" ]; then
    # Ativar modo desenvolvimento
    if [ -f "$ENV_LOCAL" ]; then
        rm "$ENV_LOCAL"
        echo "🔧 Modo DESENVOLVIMENTO ativado!"
        echo "✅ Arquivo .env.local removido"
        echo "📋 Agora usando dados mock para desenvolvimento"
    else
        echo "ℹ️  Já está em modo desenvolvimento"
    fi
else
    # Mostrar status atual
    echo "🔍 Status atual do Firebase:"
    echo ""
    if [ -f "$ENV_LOCAL" ]; then
        echo "🔥 MODO: PRODUÇÃO (Firebase real)"
        echo "📋 Configuração: .env.local ativo"
    else
        echo "🔧 MODO: DESENVOLVIMENTO (dados mock)"
        echo "📋 Configuração: .env.local não encontrado"
    fi
    echo ""
    echo "📖 Uso:"
    echo "  ./scripts/toggle-firebase.sh prod  # Ativar produção"
    echo "  ./scripts/toggle-firebase.sh dev   # Ativar desenvolvimento"
    echo "  ./scripts/toggle-firebase.sh       # Ver status atual"
fi 