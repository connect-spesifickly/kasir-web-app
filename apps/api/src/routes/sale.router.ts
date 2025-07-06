import { Router, Request, Response, NextFunction } from "express";
import SaleController from "../controllers/sale.controller";
import {
  validateCreateSale,
  validateUpdateSale,
  validateDeleteSale,
} from "../middlewares/sale.middleware";
import { verifyOwner } from "../middlewares/auth.middleware";
export const saleRouter = () => {
  const router = Router();
  router.use(
    verifyOwner as unknown as (
      req: Request,
      res: Response,
      next: NextFunction
    ) => void
  );
  router.post("/", validateCreateSale, SaleController.create);
  router.get("/", SaleController.getAll);
  router.get("/:id", SaleController.getById);
  return router;
};
