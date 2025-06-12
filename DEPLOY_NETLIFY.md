# 🚀 Deploy no Netlify - SSX Solar

## 📋 Pré-requisitos

- Conta no [Netlify](https://netlify.com)
- Projeto SSX Solar no GitHub/GitLab
- Credenciais do Firebase configuradas

## 🔧 Configuração do Deploy

### 1. Conectar Repositório

1. Acesse o [Netlify](https://netlify.com) e faça login
2. Clique em "New site from Git"
3. Conecte com GitHub/GitLab
4. Selecione o repositório `171-SSX-Solar`

### 2. Configurações de Build

O Netlify detectará automaticamente as configurações do `netlify.toml`, mas verifique:

```
Build command: npm run build
Publish directory: dist
```

### 3. Variáveis de Ambiente

**⚠️ IMPORTANTE**: Configure as variáveis de ambiente no Netlify:

1. Vá em `Site settings > Environment variables`
2. Adicione as seguintes variáveis:

```bash
# Firebase Configuration (OBRIGATÓRIO para produção)
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=ssx-solar-171.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ssx-solar-171
VITE_FIREBASE_STORAGE_BUCKET=ssx-solar-171.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-LWRJPYFEFX

# Ambiente
NODE_ENV=production
```

### 4. Domínio Personalizado (Opcional)

1. Vá em `Domain settings`
2. Clique em "Add custom domain"
3. Configure DNS conforme instruções do Netlify

## 🔥 Configuração Firebase Console

Antes do deploy, configure no Firebase Console:

### 1. Authentication
- Ative "Email/Password"
- Adicione domínio do Netlify em "Authorized domains"

### 2. Firestore Database
- Crie banco em modo produção
- Aplique as regras de segurança do arquivo `firestore.rules`

### 3. Storage (Opcional)
- Configure se necessário

## 🎯 Deploy Automático

Após configuração inicial:

1. **Push para main/master** → Deploy automático em produção
2. **Pull Requests** → Deploy preview automático
3. **Outras branches** → Deploy preview opcional

## 📊 Status do Projeto

### Modo Desenvolvimento (Padrão)
- **Sem variáveis Firebase**: Usa dados mock
- **Seguro para testes**: Não afeta dados reais
- **Interface completa**: Todas as funcionalidades disponíveis

### Modo Produção (Com Firebase)
- **Com variáveis Firebase**: Conecta ao Firebase real
- **Dados persistentes**: Firestore + Authentication
- **Analytics**: Google Analytics ativo

## 🔍 Verificação de Deploy

Após o deploy, verifique:

1. **URL funcionando**: Site carrega corretamente
2. **Firebase Status**: Console do navegador mostra conexão
3. **Modo ativo**: Verificar se está em dev ou produção
4. **Funcionalidades**: Testar login, CRUD, navegação

## 🛠️ Scripts Úteis

Para alternar modos no servidor:

```bash
# Verificar status atual
npm run firebase:status

# Ativar Firebase (produção)
npm run firebase:prod

# Voltar para desenvolvimento
npm run firebase:dev
```

## 🐛 Solução de Problemas

### Build Falha
- Verificar `package.json` e `netlify.toml`
- Conferir logs de build no Netlify

### Site Carrega mas Firebase Não Funciona
- Verificar variáveis de ambiente no Netlify
- Conferir configuração no Firebase Console
- Verificar console do navegador para erros

### Redirecionamento 404
- Verificar configuração SPA no `netlify.toml`
- Confirmar redirecionamento `/* → /index.html`

### Performance
- Chunks grandes: Considerar code splitting
- Cache: Headers configurados no `netlify.toml`

## 📞 Suporte

- **Netlify**: [Documentação oficial](https://docs.netlify.com)
- **Firebase**: [Console Firebase](https://console.firebase.google.com)
- **Logs**: Acessar logs no painel do Netlify

## 🔒 Segurança

- Headers de segurança configurados
- Firebase rules implementadas
- Variáveis de ambiente protegidas
- HTTPS automático pelo Netlify 