import { Router } from "express";
import { validateRegistration } from "../middlewares/auth.middleware";
import AuthController from "../controllers/auth.controller";

export const authRouter = () => {
  const router = Router();
  router.post("/register", validateRegistration, AuthController.register);
  return router;
};
