import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../helpers/api-response";
import saleService from "../services/sale.service";

class SaleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await saleService.create(req.body);
      ApiResponse({
        res,
        statusCode: 201,
        message: "Sale created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await saleService.getAll(req.query);
      ApiResponse({ res, statusCode: 200, message: "Sale list", data: result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await saleService.getById(req.params.id);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Sale detail",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SaleController();
