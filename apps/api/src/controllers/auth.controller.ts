import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../helpers/api-response";
import authService from "../services/auth.service";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Owner logged in successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
