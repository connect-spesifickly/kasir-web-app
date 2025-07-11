import { Router, Request, Response, NextFunction } from "express";
import ReportController from "../controllers/report.controller";
import { verifyOwner } from "../middlewares/auth.middleware";

export const reportRouter = () => {
  const router = Router();
  router.use(
    verifyOwner as unknown as (
      req: Request,
      res: Response,
      next: NextFunction
    ) => void
  );
  router.get("/sales", ReportController.sales);
  router.get("/profit", ReportController.profit);
  router.get("/losses", ReportController.losses);
  router.get("/daily-transactions", ReportController.dailyTransactions);
  return router;
};
