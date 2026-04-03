import { body } from "express-validator";
import { VALIDATION } from "@satomiq/shared";

export const registerValidator = [
  body("name")
    .trim()
    .isLength({
      min: VALIDATION.NAME_MIN_LENGTH,
      max: VALIDATION.NAME_MAX_LENGTH,
    })
    .withMessage(`Nome deve ter entre ${VALIDATION.NAME_MIN_LENGTH} e ${VALIDATION.NAME_MAX_LENGTH} caracteres`),

  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Email inválido"),

  body("password")
    .isLength({ min: VALIDATION.PASSWORD_MIN_LENGTH })
    .withMessage(`Senha deve ter no mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`)
    .matches(/[A-Z]/)
    .withMessage("Senha deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/)
    .withMessage("Senha deve conter pelo menos um número"),
];

export const loginValidator = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Email inválido"),

  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória"),
];

export const refreshTokenValidator = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token é obrigatório"),
];
