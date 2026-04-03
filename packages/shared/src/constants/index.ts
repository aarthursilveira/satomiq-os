// === PAGINATION DEFAULTS ===
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  VALID_SORT_FIELDS: ["createdAt", "updatedAt", "name", "status"],
} as const;

// === VALIDATION ===
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  SLUG_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// === JWT ===
export const JWT = {
  DEFAULT_ACCESS_EXPIRATION: "15m",
  DEFAULT_REFRESH_EXPIRATION: "7d",
} as const;

// === SECURITY ===
export const SECURITY = {
  BCRYPT_SALT_ROUNDS: 12,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: 100,
} as const;

// === CLIENT TYPES ===
export const CLIENT_TYPE_LABELS: Record<string, string> = {
  PERSON: "Pessoa Física",
  BRAND: "Marca",
  COMPANY: "Empresa",
} as const;

// === CLIENT STATUS ===
export const CLIENT_STATUS_LABELS: Record<string, string> = {
  LEAD: "Lead",
  PROSPECT: "Prospect",
  ACTIVE: "Ativo",
  PAUSED: "Pausado",
  CHURNED: "Churned",
  ARCHIVED: "Arquivado",
} as const;

export const CLIENT_STATUS_COLORS: Record<string, string> = {
  LEAD: "#3B82F6",
  PROSPECT: "#F59E0B",
  ACTIVE: "#22C55E",
  PAUSED: "#8E8E93",
  CHURNED: "#EF4444",
  ARCHIVED: "#6B7280",
} as const;

// === PROJECT STATUS ===
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  PLANNING: "Planejamento",
  IN_PROGRESS: "Em Andamento",
  REVIEW: "Revisão",
  COMPLETED: "Concluído",
  ON_HOLD: "Pausado",
  CANCELLED: "Cancelado",
} as const;

// === TASK STATUS ===
export const TASK_STATUS_LABELS: Record<string, string> = {
  TODO: "A Fazer",
  IN_PROGRESS: "Em Andamento",
  REVIEW: "Revisão",
  DONE: "Concluído",
  CANCELLED: "Cancelado",
} as const;

// === PRIORITY ===
export const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
} as const;

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#8E8E93",
  MEDIUM: "#F59E0B",
  HIGH: "#EF4444",
  URGENT: "#DC2626",
} as const;

// === CONTENT STATUS ===
export const CONTENT_STATUS_LABELS: Record<string, string> = {
  IDEA: "Ideia",
  DRAFT: "Rascunho",
  IN_REVIEW: "Em Revisão",
  SCHEDULED: "Agendado",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado",
} as const;

// === CONTENT TYPE ===
export const CONTENT_TYPE_LABELS: Record<string, string> = {
  POST: "Post",
  STORY: "Story",
  REEL: "Reel",
  CAROUSEL: "Carrossel",
  VIDEO: "Vídeo",
  BLOG: "Blog",
  EMAIL_CAMPAIGN: "Email",
} as const;

// === ACTIVITY TYPE ===
export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  NOTE_ADDED: "Nota Adicionada",
  STATUS_CHANGED: "Status Alterado",
  MEETING: "Reunião",
  CALL: "Ligação",
  EMAIL_SENT: "Email Enviado",
  WHATSAPP: "WhatsApp",
  PAYMENT_RECEIVED: "Pagamento Recebido",
  CONTRACT_SIGNED: "Contrato Assinado",
  TASK_COMPLETED: "Tarefa Concluída",
  PROJECT_CREATED: "Projeto Criado",
  CUSTOM: "Customizado",
} as const;

// === REAL CLIENTS SEED DATA ===
export const SEED_CLIENTS = [
  {
    id: "client_du",
    name: "Du - Academia Espaço Fitness Fusion",
    type: "PERSON",
    slug: "du-academia",
    status: "ACTIVE",
    description:
      "Proprietário da Academia Espaço Fitness Fusion. Projeto: Portal do aluno integrado com NextFit API.",
  },
  {
    id: "client_taina",
    name: "Tainá - Clínica de Estética Ultraformer",
    type: "PERSON",
    slug: "taina-estetica",
    status: "ACTIVE",
    description:
      "Proprietária da clínica. Projeto: Atendimento automatizado via WhatsApp com agente 'Bela'.",
  },
  {
    id: "client_satomiq",
    name: "SAtomiq - Matriz",
    type: "COMPANY",
    slug: "satomiq-matriz",
    status: "ACTIVE",
    description:
      "A própria SAtomiq. Micro-holding de automação. Gestão de conteúdo, tarefas internas e pipeline de prospecção.",
  },
  {
    id: "client_ze",
    name: "Zé Barbeiro - Barbearia",
    type: "PERSON",
    slug: "ze-barbearia",
    status: "ACTIVE",
    description: "Dono da barbearia. Projeto: Sistema de agendamento (Markio).",
  },
] as const;

// === DEFAULT PIPELINE ===
export const DEFAULT_PIPELINE = {
  name: "Funil de Vendas",
  stages: [
    { name: "Primeiro Contato", color: "#3B82F6", order: 0 },
    { name: "Proposta", color: "#8B5CF6", order: 1 },
    { name: "Negociação", color: "#F59E0B", order: 2 },
    { name: "Fechado", color: "#22C55E", order: 3 },
  ],
} as const;

// === ERROR MESSAGES ===
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Email ou senha inválidos",
  USER_NOT_FOUND: "Usuário não encontrado",
  CLIENT_NOT_FOUND: "Cliente não encontrado",
  TASK_NOT_FOUND: "Tarefa não encontrada",
  NOTE_NOT_FOUND: "Nota não encontrada",
  UNAUTHORIZED: "Não autorizado",
  FORBIDDEN: "Acesso negado",
  VALIDATION_ERROR: "Erro de validação",
  INTERNAL_ERROR: "Erro interno do servidor",
  DUPLICATE_EMAIL: "Este email já está registrado",
  INVALID_TOKEN: "Token inválido ou expirado",
} as const;

// === SUCCESS MESSAGES ===
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login realizado com sucesso",
  REGISTER_SUCCESS: "Registro realizado com sucesso",
  CLIENT_CREATED: "Cliente criado com sucesso",
  CLIENT_UPDATED: "Cliente atualizado com sucesso",
  CLIENT_DELETED: "Cliente deletado com sucesso",
  TASK_CREATED: "Tarefa criada com sucesso",
  TASK_UPDATED: "Tarefa atualizada com sucesso",
  NOTE_CREATED: "Nota criada com sucesso",
  NOTE_UPDATED: "Nota atualizada com sucesso",
} as const;
