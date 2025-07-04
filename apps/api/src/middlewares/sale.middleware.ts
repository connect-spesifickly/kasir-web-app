import { Request, Response, NextFunction } from "express";
import {
  createSaleSchema,
  updateSaleSchema,
  deleteSaleSchema,
} from "../validations/sale.validation";

export const validateCreateSale = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = createSaleSchema();
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

export const validateUpdateSale = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = updateSaleSchema();
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

export const validateDeleteSale = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = deleteSaleSchema();
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};
