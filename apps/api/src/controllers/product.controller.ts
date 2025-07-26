import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../helpers/api-response";
import productService from "../services/product.service";
import { ResponseError } from "../helpers/error";

class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.create(req.body);
      ApiResponse({
        res,
        statusCode: 201,
        message: "Product created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await productService.getCategories();
      ApiResponse({
        res,
        statusCode: 200,
        message: "Category list",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getAll(req.query);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Product list",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getById(req.params.id);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Product detail",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.update(req.params.id, req.body);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Product updated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async restock(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.restock(req.params.id, req.body);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Product restocked",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.deactivate(req.params.id);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Product deactivated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.activate(req.params.id);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Product activated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getLowStockProducts();
      ApiResponse({
        res,
        statusCode: 200,
        message: "Low stock products",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productService.createCategory(req.body.name);
      ApiResponse({
        res,
        statusCode: 201,
        message: "Category created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.delete(req.params.id);
      ApiResponse({
        res,
        statusCode: 200,
        message: "Product deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
