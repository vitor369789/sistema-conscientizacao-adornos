# 🎯 Sistema de Conscientização sobre Uso de Adornos

Sistema interativo e dinâmico para conscientização sobre segurança no uso de adornos no ambiente de trabalho, com apresentação educativa, quiz gamificado e painel administrativo completo.

## 🌟 Funcionalidades

### Para Participantes
- ✅ **Cadastro Inicial**: Registro de nome, setor, formação e telefone
- 📊 **Apresentação Interativa**: 6 slides animados sobre segurança com adornos
- 🎮 **Quiz Gamificado**: 10 questões com feedback instantâneo e explicações
- 🏆 **Sistema de Pontuação**: Acompanhamento de acertos em tempo real
- 🎉 **Resultados Visuais**: Página de resultados com animações e confetes
- 📱 **Design Responsivo**: Funciona perfeitamente em mobile, tablet e desktop

### Para Gestores
- 🔐 **Login Administrativo**: Acesso protegido por senha
- 📈 **Dashboard Completo**: Estatísticas gerais e individuais
- 👥 **Lista de Participantes**: Visualização de todos os dados cadastrados
- 🔍 **Busca e Filtros**: Pesquisa por nome/setor e filtro por setor
- 📊 **Relatórios**: Visualização de pontuação, status e data de participação
- 🖨️ **Impressão**: Geração de relatórios imprimíveis
- 🗑️ **Gerenciamento**: Exclusão de registros quando necessário

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool rápido e moderno
- **TailwindCSS** - Framework CSS utilitário
- **Framer Motion** - Animações fluidas e interativas
- **Lucide React** - Ícones modernos
- **Canvas Confetti** - Efeitos de confete
- **React Router** - Navegação entre páginas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **Better SQLite3** - Banco de dados SQLite
- **CORS** - Habilitação de requisições cross-origin

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Passo a Passo

1. **Clone ou navegue até o diretório do projeto**
```bash
cd site-consietização
```

2. **Instale as dependências do backend e frontend**
```bash
npm run install-all
```

Ou manualmente:
```bash
# Instalar dependências do backend
npm install

# Instalar dependências do frontend
cd client
npm install
cd ..
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Isso iniciará:
- Backend na porta `3001` (http://localhost:3001)
- Frontend na porta `3000` (http://localhost:3000)

4. **Acesse a aplicação**
- **Participantes**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

## 🔑 Credenciais de Acesso

### Painel Administrativo
- **Usuário**: `admin`
- **Senha**: `admin123`

## 📁 Estrutura do Projeto

```
site-consietização/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   │   ├── Registration.jsx      # Cadastro inicial
│   │   │   ├── Presentation.jsx      # Slides interativos
│   │   │   ├── Quiz.jsx              # Sistema de quiz
│   │   │   ├── Results.jsx           # Resultados e pontuação
│   │   │   ├── AdminLogin.jsx        # Login administrativo
│   │   │   └── AdminDashboard.jsx    # Painel do gestor
│   │   ├── App.jsx           # Roteamento principal
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Estilos globais
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                   # Backend Node.js
│   ├── index.js             # API Express
│   └── database.db          # Banco SQLite (criado automaticamente)
├── package.json             # Dependências do projeto
└── README.md
```

## 🎨 Características Visuais

- **Design Moderno**: Interface com gradientes, glass morphism e animações
- **Cores Vibrantes**: Paleta de cores atrativa e profissional
- **Animações Suaves**: Transições e efeitos com Framer Motion
- **Feedback Visual**: Indicadores de progresso, confetes e alertas
- **Responsividade**: Adaptação perfeita para qualquer tamanho de tela

## 📊 Conteúdo Educativo

### Tópicos da Apresentação
1. Segurança em Primeiro Lugar
2. O Que São Adornos?
3. Riscos de Acidentes
4. Casos Reais
5. Boas Práticas
6. Sua Segurança, Nossa Prioridade

### Quiz
- 10 questões sobre segurança com adornos
- Explicações detalhadas para cada resposta
- Sistema de pontuação (70% para aprovação)
- Feedback instantâneo

## 🔧 Scripts Disponíveis

```bash
# Instalar todas as dependências
npm run install-all

# Iniciar desenvolvimento (backend + frontend)
npm run dev

# Iniciar apenas o backend
npm run server

# Iniciar apenas o frontend
npm run client

# Build do frontend para produção
npm run build
```

## 💾 Banco de Dados

O sistema utiliza SQLite com a seguinte estrutura:

**Tabela: participants**
- `id` - Identificador único
- `name` - Nome completo
- `sector` - Setor de trabalho
- `formation` - Formação/escolaridade
- `phone` - Telefone de contato
- `score` - Pontuação obtida
- `total_questions` - Total de questões
- `answers` - Respostas detalhadas (JSON)
- `completed_at` - Data e hora de conclusão

## 🎯 Fluxo de Uso

1. **Participante acessa o sistema**
2. **Preenche cadastro** (nome, setor, formação, telefone)
3. **Assiste apresentação interativa** (6 slides)
4. **Realiza o quiz** (10 questões)
5. **Visualiza resultados** com pontuação e feedback
6. **Dados são salvos** no banco de dados
7. **Gestor acessa painel** para visualizar relatórios

## 🔒 Segurança

- Autenticação simples para área administrativa
- Validação de dados no frontend e backend
- Proteção contra SQL injection (prepared statements)
- CORS configurado adequadamente

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (versões recentes)
- ✅ Dispositivos móveis (iOS e Android)
- ✅ Tablets
- ✅ Desktops

## 🎓 Uso Educacional

Este sistema é ideal para:
- Treinamentos de segurança do trabalho
- Programas de conscientização empresarial
- SIPAT (Semana Interna de Prevenção de Acidentes)
- Integração de novos funcionários
- Campanhas de segurança

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todas as dependências foram instaladas
2. Certifique-se de que as portas 3000 e 3001 estão livres
3. Confira os logs do console para erros

## 📄 Licença

Este projeto é de uso livre para fins educacionais e empresariais.

---

**Desenvolvido com ❤️ para promover segurança no trabalho**
