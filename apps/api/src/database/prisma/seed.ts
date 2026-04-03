import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱 Starting seed...");

  // === CREATE USERS ===
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@satomiq.com" },
    update: {},
    create: {
      email: "admin@satomiq.com",
      passwordHash: await bcrypt.hash("Admin@123456", 12),
      name: "Arthur - Admin",
      role: "ADMIN",
      avatarUrl: null,
    },
  });

  console.log("✅ Admin user created:", adminUser.email);

  // === CREATE CLIENTS ===
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { slug: "du-academia" },
      update: {},
      create: {
        name: "Du - Academia Espaço Fitness Fusion",
        type: "PERSON",
        slug: "du-academia",
        status: "ACTIVE",
        description:
          "Proprietário da Academia Espaço Fitness Fusion. Projeto: Portal do aluno integrado com NextFit API.",
        email: "du@fitness-fusion.com",
        phone: "+5511999999999",
        whatsapp: "+5511999999999",
        instagram: "@fitness_fusion_",
        website: "https://fitness-fusion.com",
        address: "São Paulo, SP",
        contractValue: 2500.0,
        contractStart: new Date("2024-01-15"),
        contractEnd: new Date("2025-01-15"),
        paymentDay: 15,
        tags: ["academia", "fitness", "portal-aluno"],
      },
    }),

    prisma.client.upsert({
      where: { slug: "taina-estetica" },
      update: {},
      create: {
        name: "Tainá - Clínica de Estética Ultraformer",
        type: "PERSON",
        slug: "taina-estetica",
        status: "ACTIVE",
        description:
          "Proprietária da clínica. Projeto: Atendimento automatizado via WhatsApp com agente 'Bela'.",
        email: "taina@ultraformer.com",
        phone: "+5511888888888",
        whatsapp: "+5511888888888",
        instagram: "@ultraformer_clinic",
        website: "https://ultraformer-clinic.com",
        address: "São Paulo, SP",
        contractValue: 1800.0,
        contractStart: new Date("2024-03-01"),
        contractEnd: new Date("2025-03-01"),
        paymentDay: 1,
        tags: ["estética", "whatsapp-automation", "agente-ia"],
      },
    }),

    prisma.client.upsert({
      where: { slug: "satomiq-matriz" },
      update: {},
      create: {
        name: "SAtomiq - Matriz",
        type: "COMPANY",
        slug: "satomiq-matriz",
        status: "ACTIVE",
        description:
          "A própria SAtomiq. Micro-holding de automação. Gestão de conteúdo, tarefas internas e pipeline de prospecção.",
        email: "arthur@satomiq.com",
        phone: "+5511987654321",
        whatsapp: "+5511987654321",
        instagram: "@satomiq_automation",
        website: "https://satomiq.com",
        address: "São Paulo, SP",
        tags: ["internal", "holding", "automation"],
      },
    }),

    prisma.client.upsert({
      where: { slug: "ze-barbearia" },
      update: {},
      create: {
        name: "Zé Barbeiro - Barbearia",
        type: "PERSON",
        slug: "ze-barbearia",
        status: "ACTIVE",
        description: "Dono da barbearia. Projeto: Sistema de agendamento (Markio).",
        email: "ze@barbearia.com",
        phone: "+5511777777777",
        whatsapp: "+5511777777777",
        instagram: "@ze_barbeiro",
        address: "São Paulo, SP",
        contractValue: 800.0,
        contractStart: new Date("2024-02-01"),
        contractEnd: new Date("2025-02-01"),
        paymentDay: 5,
        tags: ["barbearia", "agendamento", "markio"],
      },
    }),
  ]);

  console.log("✅ Created clients:", clients.map((c) => c.name).join(", "));

  // === CREATE CONTACTS ===
  const contacts = await Promise.all([
    prisma.contact.upsert({
      where: {
        id: "contact_du_primary",
      },
      update: {},
      create: {
        id: "contact_du_primary",
        name: "Eduardo (Du)",
        role: "Proprietário",
        email: "du@fitness-fusion.com",
        phone: "+5511999999999",
        whatsapp: "+5511999999999",
        isPrimary: true,
        clientId: clients[0]!.id,
      },
    }),

    prisma.contact.upsert({
      where: {
        id: "contact_taina_primary",
      },
      update: {},
      create: {
        id: "contact_taina_primary",
        name: "Tainá",
        role: "Proprietária",
        email: "taina@ultraformer.com",
        phone: "+5511888888888",
        whatsapp: "+5511888888888",
        isPrimary: true,
        clientId: clients[1]!.id,
      },
    }),

    prisma.contact.upsert({
      where: {
        id: "contact_arthur",
      },
      update: {},
      create: {
        id: "contact_arthur",
        name: "Arthur",
        role: "CEO",
        email: "arthur@satomiq.com",
        phone: "+5511987654321",
        whatsapp: "+5511987654321",
        isPrimary: true,
        clientId: clients[2]!.id,
      },
    }),

    prisma.contact.upsert({
      where: {
        id: "contact_ze_primary",
      },
      update: {},
      create: {
        id: "contact_ze_primary",
        name: "Zé",
        role: "Proprietário",
        email: "ze@barbearia.com",
        phone: "+5511777777777",
        whatsapp: "+5511777777777",
        isPrimary: true,
        clientId: clients[3]!.id,
      },
    }),
  ]);

  console.log("✅ Created contacts:", contacts.length);

  // === CREATE DEFAULT PIPELINE ===
  const pipeline = await prisma.pipeline.upsert({
    where: { id: "pipeline_default" },
    update: {},
    create: {
      id: "pipeline_default",
      name: "Funil de Vendas",
      isDefault: true,
      stages: {
        create: [
          { name: "Primeiro Contato", color: "#3B82F6", order: 0 },
          { name: "Proposta", color: "#8B5CF6", order: 1 },
          { name: "Negociação", color: "#F59E0B", order: 2 },
          { name: "Fechado", color: "#22C55E", order: 3 },
        ],
      },
    },
    include: { stages: true },
  });

  console.log("✅ Created default pipeline with", pipeline.stages.length, "stages");

  // === CREATE PROJECTS ===
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: "project_du_portal" },
      update: {},
      create: {
        id: "project_du_portal",
        name: "Portal do Aluno - Academia Fusion",
        description: "Portal integrado com NextFit API para gestão de alunos",
        status: "IN_PROGRESS",
        priority: "HIGH",
        startDate: new Date("2024-01-15"),
        dueDate: new Date("2024-04-30"),
        clientId: clients[0]!.id,
      },
    }),

    prisma.project.upsert({
      where: { id: "project_taina_whatsapp" },
      update: {},
      create: {
        id: "project_taina_whatsapp",
        name: "Bot WhatsApp - Atendimento Automático",
        description: "Agente IA 'Bela' para atendimento via WhatsApp",
        status: "IN_PROGRESS",
        priority: "HIGH",
        startDate: new Date("2024-03-01"),
        dueDate: new Date("2024-05-31"),
        clientId: clients[1]!.id,
      },
    }),

    prisma.project.upsert({
      where: { id: "project_ze_markio" },
      update: {},
      create: {
        id: "project_ze_markio",
        name: "Sistema de Agendamento - Markio",
        description: "Implementação do Markio para gestão de agendamentos",
        status: "PLANNING",
        priority: "MEDIUM",
        startDate: new Date("2024-04-01"),
        dueDate: new Date("2024-06-30"),
        clientId: clients[3]!.id,
      },
    }),
  ]);

  console.log("✅ Created projects:", projects.map((p) => p.name).join(", "));

  // === CREATE TASKS ===
  const tasks = await Promise.all([
    prisma.task.upsert({
      where: { id: "task_1" },
      update: {},
      create: {
        id: "task_1",
        title: "Integração NextFit API",
        description: "Implementar endpoints de integração com NextFit",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: new Date("2024-03-15"),
        projectId: projects[0]!.id,
        clientId: clients[0]!.id,
        assigneeId: adminUser.id,
      },
    }),

    prisma.task.upsert({
      where: { id: "task_2" },
      update: {},
      create: {
        id: "task_2",
        title: "Design da interface do portal",
        description: "Criar mockups e design system para o portal",
        status: "DONE",
        priority: "HIGH",
        dueDate: new Date("2024-02-28"),
        projectId: projects[0]!.id,
        clientId: clients[0]!.id,
        completedAt: new Date("2024-02-25"),
      },
    }),

    prisma.task.upsert({
      where: { id: "task_3" },
      update: {},
      create: {
        id: "task_3",
        title: "Treinar agente 'Bela'",
        description: "Configurar prompts e fluxos do agente IA",
        status: "TODO",
        priority: "HIGH",
        dueDate: new Date("2024-04-15"),
        projectId: projects[1]!.id,
        clientId: clients[1]!.id,
      },
    }),

    prisma.task.upsert({
      where: { id: "task_4" },
      update: {},
      create: {
        id: "task_4",
        title: "Revisar requisitos com Zé",
        description: "Validar fluxo de agendamento com o cliente",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: new Date("2024-04-20"),
        projectId: projects[2]!.id,
        clientId: clients[3]!.id,
      },
    }),
  ]);

  console.log("✅ Created tasks:", tasks.length);

  // === CREATE NOTES ===
  const notes = await Promise.all([
    prisma.note.upsert({
      where: { id: "note_1" },
      update: {},
      create: {
        id: "note_1",
        content:
          "# Reunião com Du\n\n- Solicitou integração com salas de aula online\n- Necessário sincronizar planos de treino\n- Deadline: fim de março",
        isPinned: true,
        clientId: clients[0]!.id,
        authorId: adminUser.id,
      },
    }),

    prisma.note.upsert({
      where: { id: "note_2" },
      update: {},
      create: {
        id: "note_2",
        content:
          "# Feedback Tainá\n\n- Quer respostas mais personalizadas\n- Integrar dados de clientes existentes\n- Testar com 10 usuários antes de liberar",
        isPinned: true,
        clientId: clients[1]!.id,
        authorId: adminUser.id,
      },
    }),

    prisma.note.upsert({
      where: { id: "note_3" },
      update: {},
      create: {
        id: "note_3",
        content:
          "## Notas Técnicas - Portal Fusion\n\n- Database: PostgreSQL 16\n- Frontend: React + Vite\n- Autenticação: JWT\n- Hospedagem: EasyPanel",
        isPinned: false,
        projectId: projects[0]!.id,
        authorId: adminUser.id,
      },
    }),
  ]);

  console.log("✅ Created notes:", notes.length);

  // === CREATE ACTIVITIES ===
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        type: "PROJECT_CREATED",
        title: "Projeto criado",
        description: "Portal do Aluno foi criado",
        clientId: clients[0]!.id,
        userId: adminUser.id,
      },
    }),

    prisma.activity.create({
      data: {
        type: "NOTE_ADDED",
        title: "Nota adicionada",
        description: "Reunião com Du foi documentada",
        clientId: clients[0]!.id,
        userId: adminUser.id,
      },
    }),

    prisma.activity.create({
      data: {
        type: "TASK_COMPLETED",
        title: "Tarefa concluída",
        description: "Design da interface completado",
        clientId: clients[0]!.id,
        userId: adminUser.id,
      },
    }),

    prisma.activity.create({
      data: {
        type: "MEETING",
        title: "Reunião com cliente",
        description: "Discussão sobre requisitos do projeto",
        clientId: clients[1]!.id,
        userId: adminUser.id,
      },
    }),
  ]);

  console.log("✅ Created activities:", activities.length);

  // === CREATE PIPELINE ENTRIES ===
  const entries = await Promise.all([
    prisma.pipelineEntry.upsert({
      where: { id: "entry_du" },
      update: {},
      create: {
        id: "entry_du",
        value: 2500.0,
        notes: "Portal do aluno - Em desenvolvimento",
        clientId: clients[0]!.id,
        stageId: pipeline.stages[2]!.id,
      },
    }),

    prisma.pipelineEntry.upsert({
      where: { id: "entry_taina" },
      update: {},
      create: {
        id: "entry_taina",
        value: 1800.0,
        notes: "Bot WhatsApp - Fase de testes",
        clientId: clients[1]!.id,
        stageId: pipeline.stages[2]!.id,
      },
    }),

    prisma.pipelineEntry.upsert({
      where: { id: "entry_satomiq" },
      update: {},
      create: {
        id: "entry_satomiq",
        value: null,
        notes: "Interno - SAtomiq OS",
        clientId: clients[2]!.id,
        stageId: pipeline.stages[0]!.id,
      },
    }),

    prisma.pipelineEntry.upsert({
      where: { id: "entry_ze" },
      update: {},
      create: {
        id: "entry_ze",
        value: 800.0,
        notes: "Markio - Agendamento de barbearia",
        clientId: clients[3]!.id,
        stageId: pipeline.stages[1]!.id,
      },
    }),
  ]);

  console.log("✅ Created pipeline entries:", entries.length);

  // === CREATE CONTENT ===
  const contentItems = await Promise.all([
    prisma.contentItem.upsert({
      where: { id: "content_1" },
      update: {},
      create: {
        id: "content_1",
        title: "Post Instagram - Dica de treino",
        description: "Post sobre os benefícios do treino funcional",
        type: "POST",
        platform: ["instagram"],
        status: "DRAFT",
        clientId: clients[0]!.id,
        mediaUrls: [],
      },
    }),

    prisma.contentItem.upsert({
      where: { id: "content_2" },
      update: {},
      create: {
        id: "content_2",
        title: "Story - Promoção de verão",
        description: "Story com promoção de verão para clientes",
        type: "STORY",
        platform: ["instagram"],
        status: "SCHEDULED",
        scheduledAt: new Date("2024-04-01"),
        clientId: clients[0]!.id,
        mediaUrls: [],
      },
    }),

    prisma.contentItem.upsert({
      where: { id: "content_3" },
      update: {},
      create: {
        id: "content_3",
        title: "Blog - Rotina de skincare",
        description: "Artigo completo sobre rotina básica de skincare",
        type: "BLOG",
        platform: ["blog"],
        status: "IN_REVIEW",
        clientId: clients[1]!.id,
        mediaUrls: [],
      },
    }),
  ]);

  console.log("✅ Created content items:", contentItems.length);

  console.log("\n✨ Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
