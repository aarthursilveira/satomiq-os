# SAtomiq-OS — Sistema Operacional Interno da SAtomiq

## Identidade do Projeto
SAtomiq-OS é a plataforma interna de operações da SAtomiq, uma micro-holding de automação e sistemas digitais para negócios locais. Este é o sistema central que substitui Notion/Trello/Obsidian — um painel unificado para gestão de clientes, projetos, automações e arquivos.

## Stack Técnica
- **Frontend**: React 18+ com Vite, TypeScript, TailwindCSS v4, Framer Motion, Zustand (estado global), React Router v7, React Query (TanStack Query)
- **Backend**: Node.js com Express, TypeScript, Prisma ORM
- **Banco de dados**: PostgreSQL 16 (incluído no docker-compose.yml)
- **Infraestrutura**: Docker + Docker Compose, deploy via EasyPanel (VPS)
- **Autenticação**: JWT com refresh tokens, bcrypt para hash de senhas

## Arquitetura do Projeto (Monorepo)
satomiq-os/
├── docker-compose.yml          # PostgreSQL + Backend + Frontend
├── .env.example                # Template de variáveis (NUNCA commitar .env real)
├── .gitignore
├── README.md
│
├── packages/
│   └── shared/                 # Tipos, constantes e utilitários compartilhados
│       ├── src/
│       │   ├── types/          # Interfaces TypeScript (Client, Project, Task, etc.)
│       │   ├── constants/      # Enums de status, roles, etc.
│       │   └── utils/          # Helpers (formatação de data, validações)
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   ├── api/                    # Backend Express
│   │   ├── src/
│   │   │   ├── server.ts       # Entry point
│   │   │   ├── app.ts          # Express app setup (middlewares, routes)
│   │   │   ├── config/         # Variáveis de ambiente, constantes
│   │   │   ├── modules/        # Feature-based modules
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   └── auth.middleware.ts
│   │   │   │   ├── clients/
│   │   │   │   │   ├── clients.controller.ts
│   │   │   │   │   ├── clients.service.ts
│   │   │   │   │   ├── clients.routes.ts
│   │   │   │   │   └── clients.validator.ts
│   │   │   │   ├── projects/
│   │   │   │   ├── tasks/
│   │   │   │   ├── notes/
│   │   │   │   ├── contacts/
│   │   │   │   ├── pipelines/
│   │   │   │   └── dashboard/
│   │   │   ├── shared/
│   │   │   │   ├── middlewares/ # Error handler, rate limiter, CORS, helmet
│   │   │   │   ├── utils/      # Logger, response helpers
│   │   │   │   └── errors/     # Custom error classes
│   │   │   └── database/
│   │   │       └── prisma/
│   │   │           ├── schema.prisma
│   │   │           ├── migrations/
│   │   │           └── seed.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                    # Frontend React + Vite
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── routes/         # Definição de rotas
│       │   ├── layouts/        # Shell principal, sidebar, topbar
│       │   │   ├── AppLayout.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── Topbar.tsx
│       │   ├── pages/          # Páginas por módulo
│       │   │   ├── Dashboard/
│       │   │   ├── CRM/
│       │   │   │   ├── ClientList.tsx
│       │   │   │   ├── ClientProfile.tsx
│       │   │   │   ├── Pipeline.tsx
│       │   │   │   └── components/
│       │   │   │       ├── ClientCard.tsx
│       │   │   │       ├── ActivityTimeline.tsx
│       │   │   │       ├── StageKanban.tsx
│       │   │   │       ├── NoteEditor.tsx
│       │   │   │       ├── ContactInfo.tsx
│       │   │   │       └── ContentCalendar.tsx
│       │   │   ├── Settings/
│       │   │   └── _placeholders/  # Módulos futuros (Automações, Arquivos, etc.)
│       │   ├── components/     # Componentes reutilizáveis (Design System)
│       │   │   ├── ui/         # Primitivos: Button, Input, Modal, Badge, Avatar
│       │   │   ├── data/       # Table, KanbanBoard, Calendar, Chart
│       │   │   └── feedback/   # Toast, Skeleton, EmptyState, LoadingSpinner
│       │   ├── hooks/          # Custom hooks (useClients, usePipeline, etc.)
│       │   ├── services/       # API client (axios instance + endpoints)
│       │   ├── stores/         # Zustand stores
│       │   ├── styles/         # Global CSS, design tokens, theme
│       │   │   ├── globals.css
│       │   │   ├── tokens.css  # CSS variables do design system
│       │   │   └── animations.css
│       │   ├── lib/            # Utilitários do frontend
│       │   └── types/          # Tipos específicos do frontend
│       ├── public/
│       ├── index.html
│       ├── Dockerfile
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── package.json
│       └── tsconfig.json

## Modelo de Dados (Prisma Schema)

### Entidades Principais do CRM
```prisma
// === AUTENTICAÇÃO ===
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String
  role          UserRole  @default(ADMIN)
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  notes         Note[]
  activities    Activity[]
  tasks         Task[]
}

enum UserRole {
  ADMIN
  MEMBER
  VIEWER
}

// === CLIENTES / MARCAS ===
model Client {
  id            String       @id @default(cuid())
  name          String
  type          ClientType   // PERSON, BRAND, COMPANY
  slug          String       @unique
  avatarUrl     String?
  description   String?
  status        ClientStatus @default(ACTIVE)
  
  // Informações de contato
  email         String?
  phone         String?
  whatsapp      String?
  instagram     String?
  website       String?
  address       String?
  
  // Dados comerciais
  contractValue Decimal?     @db.Decimal(10, 2)
  contractStart DateTime?
  contractEnd   DateTime?
  paymentDay    Int?         // Dia do mês do pagamento
  
  // Metadados
  tags          String[]     // Tags flexíveis
  customFields  Json?        // Campos dinâmicos por cliente
  
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  contacts      Contact[]
  projects      Project[]
  notes         Note[]
  activities    Activity[]
  tasks         Task[]
  pipelineStages PipelineEntry[]
  contentItems  ContentItem[]
}

enum ClientType {
  PERSON
  BRAND
  COMPANY
}

enum ClientStatus {
  LEAD
  PROSPECT
  ACTIVE
  PAUSED
  CHURNED
  ARCHIVED
}

// === CONTATOS (pessoas dentro de um cliente/empresa) ===
model Contact {
  id            String    @id @default(cuid())
  name          String
  role          String?   // "Dono", "Gerente", "Marketing"
  email         String?
  phone         String?
  whatsapp      String?
  isPrimary     Boolean   @default(false)
  
  clientId      String
  client        Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// === PROJETOS ===
model Project {
  id            String        @id @default(cuid())
  name          String
  description   String?
  status        ProjectStatus @default(PLANNING)
  priority      Priority      @default(MEDIUM)
  startDate     DateTime?
  dueDate       DateTime?
  completedAt   DateTime?
  
  clientId      String
  client        Client        @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  tasks         Task[]
  notes         Note[]
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum ProjectStatus {
  PLANNING
  IN_PROGRESS
  REVIEW
  COMPLETED
  ON_HOLD
  CANCELLED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

// === TAREFAS ===
model Task {
  id            String      @id @default(cuid())
  title         String
  description   String?
  status        TaskStatus  @default(TODO)
  priority      Priority    @default(MEDIUM)
  dueDate       DateTime?
  completedAt   DateTime?
  
  projectId     String?
  project       Project?    @relation(fields: [projectId], references: [id], onDelete: SetNull)
  
  clientId      String?
  client        Client?     @relation(fields: [clientId], references: [id], onDelete: SetNull)
  
  assigneeId    String?
  assignee      User?       @relation(fields: [assigneeId], references: [id])
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
  CANCELLED
}

// === NOTAS ===
model Note {
  id            String    @id @default(cuid())
  content       String    // Markdown
  isPinned      Boolean   @default(false)
  
  clientId      String?
  client        Client?   @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  projectId     String?
  project       Project?  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  authorId      String
  author        User      @relation(fields: [authorId], references: [id])
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// === TIMELINE DE ATIVIDADES ===
model Activity {
  id            String       @id @default(cuid())
  type          ActivityType
  title         String
  description   String?
  metadata      Json?        // Dados extras por tipo de atividade
  
  clientId      String
  client        Client       @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  userId        String
  user          User         @relation(fields: [userId], references: [id])
  
  createdAt     DateTime     @default(now())
}

enum ActivityType {
  NOTE_ADDED
  STATUS_CHANGED
  MEETING
  CALL
  EMAIL_SENT
  WHATSAPP
  PAYMENT_RECEIVED
  CONTRACT_SIGNED
  TASK_COMPLETED
  PROJECT_CREATED
  CUSTOM
}

// === PIPELINE / FUNIL ===
model Pipeline {
  id            String          @id @default(cuid())
  name          String          // "Funil de Vendas", "Onboarding"
  isDefault     Boolean         @default(false)
  
  stages        PipelineStage[]
  
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model PipelineStage {
  id            String          @id @default(cuid())
  name          String          // "Primeiro Contato", "Proposta", "Negociação", "Fechado"
  color         String          // Hex color
  order         Int
  
  pipelineId    String
  pipeline      Pipeline        @relation(fields: [pipelineId], references: [id], onDelete: Cascade)
  
  entries       PipelineEntry[]
}

model PipelineEntry {
  id            String          @id @default(cuid())
  value         Decimal?        @db.Decimal(10, 2)
  notes         String?
  enteredAt     DateTime        @default(now())
  
  clientId      String
  client        Client          @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  stageId       String
  stage         PipelineStage   @relation(fields: [stageId], references: [id], onDelete: Cascade)
}

// === CALENDÁRIO DE CONTEÚDO ===
model ContentItem {
  id            String        @id @default(cuid())
  title         String
  description   String?
  type          ContentType   // POST, STORY, REEL, CAROUSEL, VIDEO, BLOG
  platform      String[]      // ["instagram", "whatsapp", "blog"]
  status        ContentStatus @default(IDEA)
  scheduledAt   DateTime?
  publishedAt   DateTime?
  mediaUrls     String[]
  
  clientId      String
  client        Client        @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum ContentType {
  POST
  STORY
  REEL
  CAROUSEL
  VIDEO
  BLOG
  EMAIL_CAMPAIGN
}

enum ContentStatus {
  IDEA
  DRAFT
  IN_REVIEW
  SCHEDULED
  PUBLISHED
  ARCHIVED
}
```

## Regras de Código — OBRIGATÓRIAS

### Segurança (Prioridade Máxima)
1. NUNCA hardcodar segredos — tudo via variáveis de ambiente
2. NUNCA commitar .env — apenas .env.example com valores fictícios
3. Usar Helmet.js no Express
4. Configurar CORS restritivo (apenas domínios permitidos)
5. Rate limiting em todas as rotas de autenticação
6. Sanitizar TODAS as entradas do usuário (express-validator ou zod)
7. JWT com expiração curta (15min access, 7d refresh)
8. Senhas hasheadas com bcrypt (salt rounds >= 12)
9. Docker NÃO rodar como root (usar USER node)
10. Prisma: sempre usar parameterized queries (já faz por padrão)

### Backend
1. Arquitetura modular por feature (não por tipo de arquivo)
2. Cada módulo tem: controller → service → routes → validator
3. Controllers lidam com HTTP; Services lidam com lógica de negócio
4. Middleware de erro global que captura tudo
5. Logger estruturado (pino ou winston)
6. Respostas padronizadas: `{ success: boolean, data?: T, error?: string, meta?: {} }`
7. Paginação em todas as listagens: `?page=1&limit=20&sort=createdAt&order=desc`
8. Validação de input com Zod antes de chegar no service

### Frontend
1. Design System próprio — componentes em `components/ui/`
2. Hooks customizados para toda lógica reutilizável
3. React Query para cache e estado de servidor
4. Zustand para estado local/global do app
5. Lazy loading de rotas e páginas
6. Skeletons para loading states, nunca spinners genéricos
7. Animações com Framer Motion — sutis, rápidas, intencionais
8. Tema escuro como padrão com possibilidade de light mode
9. Responsivo mobile-first (mas foco primário em desktop)
10. Toast notifications para feedback de ações

### Docker & Deploy
1. Multi-stage build nos Dockerfiles
2. PostgreSQL com volume persistente no docker-compose
3. Health checks em todos os serviços
4. Variáveis de ambiente via arquivo .env no host
5. Nginx como reverse proxy no EasyPanel
6. Backup automático do PostgreSQL (pg_dump via cron)

## Design System — Identidade Visual SAtomiq-OS

### Filosofia
Interface que respira profissionalismo e modernidade. Inspiração em tools como Linear, Notion e Raycast — mas com personalidade própria. Clean, não genérico. Sofisticado, não enfeitado.

### Cores (Dark Mode Primário)
```css
:root {
  /* Base */
  --bg-primary: #0A0A0B;        /* Fundo principal - quase preto */
  --bg-secondary: #111113;      /* Cards, sidebars */
  --bg-tertiary: #1A1A1E;       /* Hover, elevated surfaces */
  --bg-elevated: #222226;       /* Modais, dropdowns */
  
  /* Bordas */
  --border-subtle: #1F1F23;     /* Bordas sutis */
  --border-default: #2A2A2F;    /* Bordas padrão */
  --border-strong: #3A3A40;     /* Bordas em foco */
  
  /* Texto */
  --text-primary: #EDEDEF;      /* Texto principal */
  --text-secondary: #8E8E93;    /* Texto secundário */
  --text-tertiary: #5A5A5F;     /* Texto discreto */
  --text-inverse: #0A0A0B;      /* Texto em superfícies claras */
  
  /* Accent — Azul elétrico SAtomiq */
  --accent-primary: #2563EB;    /* Ações primárias */
  --accent-hover: #3B82F6;      /* Hover */
  --accent-subtle: #1E3A5F;     /* Backgrounds com accent */
  --accent-glow: rgba(37, 99, 235, 0.15); /* Glow effects */
  
  /* Status */
  --status-success: #22C55E;
  --status-warning: #F59E0B;
  --status-error: #EF4444;
  --status-info: #3B82F6;
  
  /* Gradients */
  --gradient-accent: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
  --gradient-surface: linear-gradient(180deg, #111113 0%, #0A0A0B 100%);
}
```

### Tipografia
- **Display / Títulos**: "Satoshi" ou "General Sans" (fontes do Fontshare — grátis para uso comercial)
- **Body / Leitura**: "Inter Variable" — exceção aceita aqui por legibilidade em dados
- **Mono / Código**: "JetBrains Mono"
- Escala: 12 / 13 / 14 / 16 / 20 / 24 / 32 / 40 / 48px
- Tracking: -0.02em em títulos, 0 em body

### Espaçamento
- Base unit: 4px
- Escala: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80px
- Padding de cards: 20px
- Gap padrão em grids: 16px
- Sidebar width: 260px (colapsável para 64px)

### Componentes-Chave
- **Cards**: bg-secondary, border-subtle, border-radius 12px, sombra sutil
- **Botões**: height 36px (sm: 32px, lg: 40px), border-radius 8px, transição 150ms
- **Inputs**: height 36px, bg-tertiary, border-default, focus: border-strong + accent-glow
- **Badges**: height 22px, border-radius 6px, font-size 12px, font-weight 500
- **Avatar**: border-radius 50%, sizes 24/32/40/48px, fallback com iniciais + cor gerada
- **Sidebar**: fixa à esquerda, bg-secondary, ícones Lucide React, tooltip no modo colapsado
- **Modais**: overlay com blur(4px), card centralizado, max-width 520px
- **Tabelas**: sem bordas externas, linhas com hover sutil, header sticky

### Animações
- Entradas de página: fade-in 200ms + translateY(8px)
- Cards: stagger de 50ms entre itens
- Hover em cards: translateY(-2px) + sombra expandida
- Sidebar toggle: width transition 200ms ease
- Modais: fade + scale(0.96→1) 200ms
- Skeleton shimmer: gradiente animado 1.5s infinite
- Kanban drag: shadow elevation + scale(1.02)

## Módulos do Sistema — Roadmap

### ✅ Fase 1 — CRM (MVP)
- [x] Dashboard com KPIs
- [x] Lista de clientes (grid/list view)
- [x] Perfil do cliente (tabbed interface)
- [x] Pipeline/Funil visual (Kanban)
- [x] Notas por cliente (rich text)
- [x] Timeline de atividades
- [x] Tarefas vinculadas a clientes/projetos
- [x] Calendário de conteúdo
- [x] Contatos por cliente
- [x] Busca global

### 🔲 Fase 2 — Projetos & Workflows
- [ ] Board de projetos (Kanban por status)
- [ ] Templates de projeto
- [ ] Milestones e entregas

### 🔲 Fase 3 — Automações
- [ ] Visualizar workflows n8n conectados
- [ ] Logs de execução
- [ ] Triggers manuais

### 🔲 Fase 4 — Arquivos & Docs
- [ ] Upload e organização de arquivos por cliente
- [ ] Visualizador de documentos
- [ ] Contratos e propostas

### 🔲 Fase 5 — Financeiro
- [ ] Controle de recebimentos por cliente
- [ ] Relatórios de faturamento
- [ ] Alertas de vencimento

## Exemplos de Endpoints da API
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh
GET    /api/clients                    # Lista com paginação + filtros
POST   /api/clients                    # Criar cliente
GET    /api/clients/:id                # Perfil completo
PATCH  /api/clients/:id                # Atualizar
DELETE /api/clients/:id                # Soft delete
GET    /api/clients/:id/notes
POST   /api/clients/:id/notes
GET    /api/clients/:id/activities
GET    /api/clients/:id/tasks
GET    /api/clients/:id/contacts
GET    /api/clients/:id/content
GET    /api/pipelines
GET    /api/pipelines/:id/entries
PATCH  /api/pipelines/entries/:id/move  # Mover entre stages
GET    /api/tasks?status=TODO&assignee=me
POST   /api/tasks
PATCH  /api/tasks/:id
GET    /api/dashboard/stats             # KPIs agregados

## Docker Compose (Produção — EasyPanel)
```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: satomiq-os-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME:-satomiq_os}
      POSTGRES_USER: ${DB_USER:-satomiq}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-satomiq}"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: satomiq-os-api
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER:-satomiq}:${DB_PASSWORD}@postgres:5432/${DB_NAME:-satomiq_os}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN:-https://os.satomiq.com}
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    command: >
      sh -c "npx prisma migrate deploy && node dist/server.js"

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      args:
        VITE_API_URL: ${VITE_API_URL:-https://api-os.satomiq.com}
    container_name: satomiq-os-web
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - api

volumes:
  postgres_data:
```

## Contexto do Negócio (Para o AI entender os dados)
A SAtomiq atende negócios locais com automação e sistemas. Clientes atuais incluem:
- **Du (Eduardo)** — Dono da academia Espaço Fitness Fusion. Projeto: portal do aluno integrado com NextFit API.
- **Tainá** — Clínica de estética (Ultraformer). Projeto: atendimento automatizado via WhatsApp com agente "Bela".
- **SAtomiq** — A própria marca, tratada como "cliente" para gestão de conteúdo, tarefas internas e pipeline de prospecção.
- **Zé Barbeiro** — Barbearia. Projeto: sistema de agendamento (Markio).

O CRM precisa tratar igualmente pessoas, empresas e marcas. A SAtomiq é uma micro-holding com sub-marcas chamadas "Elétrons" — Markio é a primeira.