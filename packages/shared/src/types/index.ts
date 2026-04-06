// === AUTH ===
export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// === CLIENTS ===
export enum ClientType {
  PERSON = "PERSON",
  BRAND = "BRAND",
  COMPANY = "COMPANY",
}

export enum ClientStatus {
  LEAD = "LEAD",
  PROSPECT = "PROSPECT",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  CHURNED = "CHURNED",
  ARCHIVED = "ARCHIVED",
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  slug: string;
  avatarUrl: string | null;
  description: string | null;
  status: ClientStatus;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  address: string | null;
  contractValue: number | null;
  contractStart: Date | null;
  contractEnd: Date | null;
  paymentDay: number | null;
  tags: string[];
  customFields: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

// === CONTACTS ===
export interface Contact {
  id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  isPrimary: boolean;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

// === PROJECTS ===
export enum ProjectStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  startDate: Date | null;
  dueDate: Date | null;
  completedAt: Date | null;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

// === TASKS ===
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date | null;
  completedAt: Date | null;
  projectId: string | null;
  clientId: string | null;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// === NOTES ===
export interface Note {
  id: string;
  content: string;
  isPinned: boolean;
  clientId: string | null;
  projectId: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// === ACTIVITIES ===
export enum ActivityType {
  NOTE_ADDED = "NOTE_ADDED",
  STATUS_CHANGED = "STATUS_CHANGED",
  MEETING = "MEETING",
  CALL = "CALL",
  EMAIL_SENT = "EMAIL_SENT",
  WHATSAPP = "WHATSAPP",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  CONTRACT_SIGNED = "CONTRACT_SIGNED",
  TASK_COMPLETED = "TASK_COMPLETED",
  PROJECT_CREATED = "PROJECT_CREATED",
  CUSTOM = "CUSTOM",
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  clientId: string;
  userId: string;
  createdAt: Date;
}

// === PIPELINE ===
export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  pipelineId: string;
}

export interface Pipeline {
  id: string;
  name: string;
  isDefault: boolean;
  stages: PipelineStage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineEntry {
  id: string;
  title: string | null;
  value: number | null;
  notes: string | null;
  enteredAt: Date;
  mediaUrls: string[];
  clientId: string | null;
  stageId: string;
}

// === CONTENT ===
export enum ContentType {
  POST = "POST",
  STORY = "STORY",
  REEL = "REEL",
  CAROUSEL = "CAROUSEL",
  VIDEO = "VIDEO",
  BLOG = "BLOG",
  EMAIL_CAMPAIGN = "EMAIL_CAMPAIGN",
}

export enum ContentStatus {
  IDEA = "IDEA",
  DRAFT = "DRAFT",
  IN_REVIEW = "IN_REVIEW",
  SCHEDULED = "SCHEDULED",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  type: ContentType;
  platform: string[];
  status: ContentStatus;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  mediaUrls: string[];
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

// === API RESPONSES ===
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
}
