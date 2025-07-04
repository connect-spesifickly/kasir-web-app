import { Router, Request, Response, NextFunction } from "express";
import StockAdjustmentController from "../controllers/stock-adjustment.controller";
import { validateCreateStockAdjustment } from "../middlewares/stock-adjustment.middleware";
import { verifyOwner } from "../middlewares/auth.middleware";

export const stockAdjustmentRouter = () => {
  const router = Router();
  router.use(
    verifyOwner as unknown as (
      req: Request,
      res: Response,
      next: NextFunction
    ) => void
  );
  router.post(
    "/",
    validateCreateStockAdjustment,
    StockAdjustmentController.create
  );
  return router;
};
