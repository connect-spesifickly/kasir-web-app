import { Request, Response, NextFunction } from "express";
import { createStockAdjustmentSchema } from "../validations/stock-adjustment.validation";

export const validateCreateStockAdjustment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = createStockAdjustmentSchema();
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};
