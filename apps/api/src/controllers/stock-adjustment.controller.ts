import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../helpers/api-response";
import stockAdjustmentService from "../services/stock-adjustment.service";

class StockAdjustmentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await stockAdjustmentService.create(req.body);
      ApiResponse({
        res,
        statusCode: 201,
        message: "Stock adjusted",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await stockAdjustmentService.getAll(req.query);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Stock adjustment list",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new StockAdjustmentController();
