import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../helpers/api-response";
import authService from "../services/auth.service";
import { putOwnerAccessToken } from "../helpers/jwt";
import { hbs } from "../helpers/handlebars";
import { transporter } from "../helpers/nodemailer";

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

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      ApiResponse({
        res,
        statusCode: 201,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Token refreshed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPasswordRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const compilePasswordResetRequest = await hbs("reset-password-template");
      const { accessToken } = await putOwnerAccessToken(
        undefined,
        req.body.email
      );
      const html = compilePasswordResetRequest({
        email: req.body.email,
        token: accessToken,
        role: "Owner",
      });
      transporter.sendMail({
        to: req.body.email,
        subject: "Reset Password",
        html,
      });
      ApiResponse({
        res,
        statusCode: 200,
        message:
          "Link reset passsword has been send successfully to your email",
        data: undefined,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Password reset successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
