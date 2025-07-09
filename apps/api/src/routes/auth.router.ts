import { Router } from "express";
import {
  validateOwnerLogin,
  // validateOwnerRegister,
} from "../middlewares/auth.middleware";
import AuthController from "../controllers/auth.controller";

export const authRouter = () => {
  const router = Router();
  router.post("/login", validateOwnerLogin, AuthController.login);
  // router.post("/register", validateOwnerRegister, AuthController.register);
  router.post("/refresh-token", AuthController.refreshToken);
  router.post("/forgot-password-request", AuthController.forgotPasswordRequest);
  router.post("/reset-password", AuthController.resetPassword);
  return router;
};
