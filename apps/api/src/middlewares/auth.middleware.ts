import { Request, Response, NextFunction } from "express";
import { technicianRegistrationSchema } from "../validations/technician-registration.validation";

const validateRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = technicianRegistrationSchema();
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

export { validateRegistration };
