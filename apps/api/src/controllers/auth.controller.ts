import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../helpers/api-response";
import authService from "../services/auth.service";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      ApiResponse({
        res,
        statusCode: 201,
        message: "Technician registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
