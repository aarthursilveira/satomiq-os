import { Router } from "express";
import { authenticate } from "@/modules/auth/auth.middleware.js";
import * as clientsController from "@/modules/clients/clients.controller.js";
import {
  createClientValidator,
  updateClientValidator,
  listClientsValidator,
  clientIdValidator,
} from "@/modules/clients/clients.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", listClientsValidator, clientsController.list);
router.post("/", createClientValidator, clientsController.create);
router.get("/:id", clientIdValidator, clientsController.getById);
router.patch("/:id", [...clientIdValidator, ...updateClientValidator], clientsController.update);
router.delete("/:id", clientIdValidator, clientsController.remove);

export default router;
