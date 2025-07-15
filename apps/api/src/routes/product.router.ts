import { Router } from "express";
import ProductController from "../controllers/product.controller";
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateRestockProduct,
} from "../middlewares/product.middleware";
import { verifyOwner } from "../middlewares/auth.middleware";

export const productRouter = () => {
  const router = Router();
  router.use(verifyOwner as any);
  router.post("/", validateCreateProduct, ProductController.create);
  router.get("/", ProductController.getAll);
  router.get("/low-stock", ProductController.getLowStock);
  router.get("/:id", ProductController.getById);
  router.patch("/:id", validateUpdateProduct, ProductController.update);
  router.delete("/:id", ProductController.delete);
  router.patch("/:id/deactivate", ProductController.deactivate);
  router.post(
    "/:id/restock",
    validateRestockProduct,
    ProductController.restock
  );
  return router;
};
