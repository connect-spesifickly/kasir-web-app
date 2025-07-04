import { Request } from "express";

export interface OwnerToken {
  id: string;
  email: string;
  role: string;
}
export interface OwnerRequest extends Request {
  user: OwnerToken;
}
