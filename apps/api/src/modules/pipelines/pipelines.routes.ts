import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "@/modules/auth/auth.middleware.js";
import * as pipelinesController from "@/modules/pipelines/pipelines.controller.js";

const router = Router();

router.use(authenticate);

const createPipelineValidator = [
  body("name").trim().notEmpty().withMessage("Nome do pipeline é obrigatório"),
];

const moveEntryValidator = [
  body("stageId").notEmpty().withMessage("stageId é obrigatório"),
];

const createEntryValidator = [
  body("clientId").notEmpty().withMessage("clientId é obrigatório"),
  body("stageId").notEmpty().withMessage("stageId é obrigatório"),
  body("value").optional().isFloat({ min: 0 }),
];

router.get("/", pipelinesController.list);
router.post("/", createPipelineValidator, pipelinesController.create);
router.get("/:id", pipelinesController.getById);
router.get("/:id/entries", pipelinesController.getEntries);
router.post("/entries", createEntryValidator, pipelinesController.createEntry);
router.patch("/entries/:entryId/move", moveEntryValidator, pipelinesController.moveEntry);
router.delete("/entries/:entryId", pipelinesController.deleteEntry);

export default router;
