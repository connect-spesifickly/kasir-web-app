import { Request, Response, NextFunction } from "express";
import {
  createProductSchema,
  updateProductSchema,
  restockProductSchema,
} from "../validations/product.validation";

export const validateCreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = createProductSchema();
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

export const validateUpdateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = updateProductSchema();
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

export const validateRestockProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = restockProductSchema();
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};
