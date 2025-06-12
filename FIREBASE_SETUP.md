# 🔥 Configuração Firebase - SSX Solar

## 📋 Resumo

O projeto está configurado com suas credenciais Firebase reais de produção. O sistema alterna automaticamente entre modo desenvolvimento (dados mock) e produção (Firebase real) baseado na presença do arquivo `.env.local`.

## 🔧 Configuração Atual

### Credenciais Firebase Produção:
- **Projeto:** ssx-8961b
- **API Key:** AIzaSyCRd24XrY_GJUh2kgbi-Ilu1kbFB_QQBEY
- **Auth Domain:** ssx-8961b.firebaseapp.com
- **Storage:** ssx-8961b.firebasestorage.app

### Analytics:
- **Measurement ID:** G-LWRJPYFEFX
- ✅ Google Analytics integrado e funcionando

## 🚀 Como Usar

### Modo Desenvolvimento (Padrão)
```bash
# Usar dados mock (padrão - protege suas contas)
npm run dev
```

### Modo Produção (Firebase Real)
```bash
# Ativar Firebase real
npm run firebase:prod

# Executar em produção
npm run dev
```

### Verificar Status Atual
```bash
npm run firebase:status
```

### Voltar para Desenvolvimento
```bash
npm run firebase:dev
```

## ⚠️  Cuidados Importantes

### 🛡️ Proteção de Contas de Teste

**O sistema está configurado para PROTEGER suas contas:**

1. **Por padrão** roda em modo mock (dados falsos)
2. **Só usa Firebase real** quando você EXPLICITAMENTE ativa
3. **Logs claros** mostram qual modo está ativo
4. **Scripts fáceis** para alternar entre modos

### 🔒 Segurança

- ✅ Arquivo `.env.local` no `.gitignore` (não vai para Git)
- ✅ Credenciais em arquivo separado (`firebase-config.env`)
- ✅ Scripts para alternar facilmente entre modos
- ✅ Logs informativos sobre qual modo está ativo

## 📊 Firebase Console - Configurações Necessárias

### 🔐 Authentication
1. Acesse: https://console.firebase.google.com/project/ssx-8961b/authentication
2. Vá em "Sign-in method"
3. Ative "Email/Password"
4. ⚠️ **IMPORTANTE:** Configure domínios autorizados se necessário

### 🗄️ Firestore Database
1. Acesse: https://console.firebase.google.com/project/ssx-8961b/firestore
2. Crie o banco se não existir
3. ⚠️ **IMPORTANTE:** Configure as regras de segurança:

**Copie as regras do arquivo `firestore.rules` para o console:**
- As regras implementam segurança por roles (admin/installer/client)
- Clientes só acessam seus próprios dados
- Instaladores acessam serviços atribuídos a eles
- Admins têm acesso completo

4. ⚠️ **IMPORTANTE:** Configure os índices necessários:
- Ver detalhes completos em: `firestore-indexes.md`
- O Firebase sugerirá automaticamente os índices quando executar queries
- Índices críticos: `serviceRequests` por `clientId` e `installerId`

### 📦 Storage
**❌ NÃO SERÁ USADO** - Cliente ainda não cadastrou cartão no Firebase
- As funções de upload estão em modo mock
- Storage pode ser configurado posteriormente quando necessário

### 📈 Analytics
- ✅ Já configurado automaticamente
- ✅ Dados começarão a aparecer após uso

## 🧪 Índices Firestore

Se você receber erros sobre índices compostos, acesse:
https://console.firebase.google.com/project/ssx-8961b/firestore/indexes

O Firebase geralmente sugere automaticamente os índices necessários quando você executa queries complexas.

## 🔄 Logs do Sistema

### Modo Desenvolvimento:
```
🔧 [FIREBASE] Modo desenvolvimento detectado - usando dados mock
📋 [DEV MODE] Carregando dados mock para cliente...
✅ [DEV MODE] 3 solicitações encontradas
```

### Modo Produção:
```
🔥 [FIREBASE] Inicializando Firebase com configuração real...
✅ [FIREBASE] Firebase inicializado com sucesso
📊 [FIREBASE] Projeto: ssx-8961b
📊 [FIREBASE] Analytics inicializado
```

## 🚨 Troubleshooting

### Firebase não conecta
1. Verifique se as regras de segurança estão corretas
2. Confirme que o projeto existe no console
3. Verifique se Authentication está habilitado

### Analytics não funciona
- Analytics pode demorar algumas horas para mostrar dados
- Verifique se o domain está autorizado no Firebase

### Dados não persistem
- Confirme que está em modo produção: `npm run firebase:status`
- Verifique as regras do Firestore

## 📞 Comandos Rápidos

```bash
# Ver status atual
npm run firebase:status

# Ativar produção (Firebase real)
npm run firebase:prod

# Voltar para desenvolvimento (dados mock)
npm run firebase:dev

# Executar aplicação
npm run dev
```

---

**🎯 Resultado:** Sistema configurado de forma segura com alternância fácil entre desenvolvimento e produção, protegendo suas contas de teste por padrão. 