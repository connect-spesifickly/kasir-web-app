import { Router } from "express";
import { validateOwnerLogin } from "../middlewares/auth.middleware";
import AuthController from "../controllers/auth.controller";

export const authRouter = () => {
  const router = Router();
  router.post("/login", validateOwnerLogin, AuthController.login);
  return router;
};
