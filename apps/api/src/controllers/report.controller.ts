import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../helpers/api-response";
import reportService from "../services/report.service";

class ReportController {
  async sales(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      const result = await reportService.salesReport({
        startDate: String(startDate),
        endDate: String(endDate),
      });
      ApiResponse({
        res,
        statusCode: 200,
        message: "Sales report",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async profit(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      const result = await reportService.profitReport({
        startDate: String(startDate),
        endDate: String(endDate),
      });
      ApiResponse({
        res,
        statusCode: 200,
        message: "Profit report",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async losses(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      const result = await reportService.lossesReport({
        startDate: String(startDate),
        endDate: String(endDate),
      });
      ApiResponse({
        res,
        statusCode: 200,
        message: "Losses report",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async dailyTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      const result = await reportService.dailyTransactionsReport({
        startDate: String(startDate),
        endDate: String(endDate),
      });
      ApiResponse({
        res,
        statusCode: 200,
        message: "Daily transactions report",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ReportController();
