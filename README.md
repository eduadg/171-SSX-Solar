# SSX Solar - Sistema de Gerenciamento de Instalações

Aplicativo web para a empresa SSX Solar gerenciar seus serviços de instalação de aquecedores solares e a gás. O sistema possui três tipos de usuários: cliente, instalador (funcionário) e administrador (central da empresa).

## Funcionalidades

### Painel do Cliente
- Solicitar instalação de equipamentos (aquecedores solares ou a gás)
- Acompanhar status de solicitações
- Confirmar conclusão do serviço
- Visualizar histórico de serviços

### Painel do Instalador
- Visualizar serviços designados
- Registrar início e conclusão de serviços
- Documentar instalação com fotos
- Adicionar observações técnicas

### Painel do Administrador
- Cadastrar/gerenciar instaladores
- Visualizar todas as solicitações
- Atribuir serviços aos instaladores
- Gerenciar catálogo de produtos e serviços

## Tecnologias Utilizadas

- React 19
- Firebase (Authentication, Firestore, Storage)
- Material UI (MUI)
- React Router
- React Hook Form

## Requisitos do Sistema

- Node.js 18 ou superior
- NPM 8 ou superior
- Conta Firebase

## Configuração do Projeto

1. Clone o repositório:
```bash
git clone https://github.com/eduadg/171-SSX-Solar.git
cd 171-SSX-Solar
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Firebase:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative Authentication, Firestore e Storage
   - Copie as credenciais de configuração do seu projeto Firebase
   - Atualize o arquivo `src/config/firebase.js` com suas credenciais

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
  ├── components/           # Componentes da UI
  │   ├── admin/            # Componentes do painel de administrador
  │   ├── auth/             # Componentes de autenticação
  │   ├── client/           # Componentes do painel de cliente
  │   └── installer/        # Componentes do painel de instalador
  ├── config/               # Configurações da aplicação
  ├── contexts/             # Contextos React (AuthContext)
  ├── hooks/                # Custom hooks
  ├── layouts/              # Layouts da aplicação
  ├── pages/                # Páginas principais
  ├── services/             # Serviços (Firebase, API)
  └── utils/                # Funções utilitárias
```

## Funcionalidades Offline

O sistema inclui modo offline para instaladores em campo com sincronização posterior dos dados quando a conexão for restaurada.

## Responsividade

A aplicação é completamente responsiva, permitindo uso em campo via celular ou tablet pelos instaladores.

## Sistema de Notificações

Implementa um sistema de notificações para todos os usuários sobre atualizações de status das solicitações.

## Licença

Este projeto é licenciado sob a licença MIT - consulte o arquivo LICENSE para obter detalhes.
