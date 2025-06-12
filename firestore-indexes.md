# 🔍 Índices Firestore Necessários - SSX Solar

## 📋 Índices Compostos Obrigatórios

### 1. Coleção `serviceRequests`

#### Índice 1: Solicitações por Cliente
- **Coleção:** `serviceRequests`
- **Campos:**
  - `clientId` (Ascending)
  - `createdAt` (Descending)
- **Usado em:** `getClientServiceRequests()`

#### Índice 2: Solicitações por Instalador  
- **Coleção:** `serviceRequests`
- **Campos:**
  - `installerId` (Ascending)
  - `createdAt` (Descending)
- **Usado em:** `getInstallerServiceRequests()`

### 2. Coleção `users`

#### Índice 3: Instaladores
- **Coleção:** `users`
- **Campos:**
  - `role` (Ascending)
  - `createdAt` (Descending)
- **Usado em:** `getAllInstallers()`

#### Índice 4: Clientes
- **Coleção:** `users`
- **Campos:**
  - `role` (Ascending) 
  - `createdAt` (Descending)
- **Usado em:** `getAllClients()`

### 3. Coleção `products`

#### Índice 5: Produtos por Tipo
- **Coleção:** `products`
- **Campos:**
  - `type` (Ascending)
  - `createdAt` (Descending)
- **Usado em:** `getProductsByType()`

## ⚡ Índices Simples (Criados Automaticamente)

Estes são criados automaticamente pelo Firebase:
- `serviceRequests.createdAt` (Descending)
- `products.createdAt` (Descending)
- `users.role` (Ascending)
- `products.type` (Ascending)

## 🛠️ Como Criar os Índices

### Método 1: Automático (Recomendado)
1. Execute sua aplicação em modo produção
2. Faça queries que usam os índices
3. O Firebase mostrará erros com links diretos para criar os índices
4. Clique nos links e confirme a criação

### Método 2: Manual
1. Acesse: https://console.firebase.google.com/project/ssx-8961b/firestore/indexes
2. Clique em "Create Index"
3. Configure cada índice conforme listado acima

## 🚨 Ordem de Prioridade

1. **CRÍTICO:** `serviceRequests` com `clientId + createdAt`
2. **CRÍTICO:** `serviceRequests` com `installerId + createdAt`
3. **IMPORTANTE:** `users` com `role + createdAt` 
4. **OPCIONAL:** `products` com `type + createdAt`

## 💡 Dica

Quando você executar a aplicação pela primeira vez em produção, o Firebase automaticamente detectará as queries e sugerirá os índices necessários no console do navegador. É a forma mais fácil! 