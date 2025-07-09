import { Request, Response, NextFunction } from "express";
import {
  ownerLoginSchema,
  ownerRegisterSchema,
} from "../validations/owner-login.validation";
import { OwnerRequest, OwnerToken } from "../interfaces/middleware.interface";
import { JWT_ACCESS_SECRET } from "../config";
import { ResponseError } from "../helpers/error";
import jwt from "jsonwebtoken";

const validateOwnerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = ownerLoginSchema();
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const validateOwnerRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = ownerRegisterSchema();
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

export function verifyOwner(
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;
    const token = String(authorization || "").split("Bearer ")[1];
    if (!token) throw new ResponseError(401, "Unauthenticated.");

    const verifiedUser = jwt.verify(token, JWT_ACCESS_SECRET) as OwnerToken;
    if (!verifiedUser || verifiedUser.role !== "Owner")
      throw new ResponseError(403, "Unauthorized.");

    req.user = verifiedUser as OwnerToken;

    next();
  } catch (err) {
    next(err);
  }
}

export { validateOwnerLogin, validateOwnerRegister };
