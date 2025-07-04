import prisma from "../prisma";
import { ResponseError } from "../helpers/error";

class SaleService {
  async create({ cart }: { cart: { productId: string; quantity: number }[] }) {
    return prisma.$transaction(async (tx: typeof prisma) => {
      for (const item of cart) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!product)
          throw new ResponseError(404, `Product not found: ${item.productId}`);
        if (product.stock < item.quantity)
          throw new ResponseError(
            400,
            `Stock not enough for product: ${product.productName}`
          );
      }
      let totalAmount = 0;
      for (const item of cart) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        totalAmount += Number(product.price) * item.quantity;
      }
      const sale = await tx.sale.create({ data: { totalAmount } });
      for (const item of cart) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        await tx.saleDetail.create({
          data: {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtSale: product.price,
            costAtSale: product.costPrice,
          },
        });
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      return tx.sale.findUnique({
        where: { id: sale.id },
        include: { saleDetails: true },
      });
    });
  }

  async getAll(query: any) {
    const { search, skip, take, startDate, endDate } = query;
    const filter: any = {};
    if (search) {
      filter.saleDetails = {
        some: {
          product: { productName: { contains: search, mode: "insensitive" } },
        },
      };
    }
    if (startDate && endDate) {
      filter.transactionTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    return prisma.sale.findMany({
      where: filter,
      skip: Number(skip) || 0,
      take: Number(take) || 100,
      include: { saleDetails: true },
    });
  }

  async getById(id: string) {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { saleDetails: true },
    });
    if (!sale) throw new ResponseError(404, "Sale not found");
    return sale;
  }

  async update(
    id: string,
    { cart }: { cart: { productId: string; quantity: number }[] }
  ) {
    return prisma.$transaction(async (tx: typeof prisma) => {
      const sale = await tx.sale.findUnique({ where: { id } });
      if (!sale) throw new ResponseError(404, "Sale not found");
      const oldDetails = await tx.saleDetail.findMany({
        where: { saleId: id },
      });
      for (const detail of oldDetails) {
        await tx.product.update({
          where: { id: detail.productId },
          data: { stock: { increment: detail.quantity } },
        });
      }
      await tx.saleDetail.deleteMany({ where: { saleId: id } });
      for (const item of cart) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!product)
          throw new ResponseError(404, `Product not found: ${item.productId}`);
        if (product.stock < item.quantity)
          throw new ResponseError(
            400,
            `Stock not enough for product: ${product.productName}`
          );
      }
      let totalAmount = 0;
      for (const item of cart) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        totalAmount += Number(product.price) * item.quantity;
      }
      await tx.sale.update({ where: { id }, data: { totalAmount } });
      for (const item of cart) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        await tx.saleDetail.create({
          data: {
            saleId: id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtSale: product.price,
            costAtSale: product.costPrice,
          },
        });
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      return tx.sale.findUnique({
        where: { id },
        include: { saleDetails: true },
      });
    });
  }

  async delete(id: string) {
    return prisma.$transaction(async (tx: typeof prisma) => {
      const sale = await tx.sale.findUnique({ where: { id } });
      if (!sale) throw new ResponseError(404, "Sale not found");
      const details = await tx.saleDetail.findMany({ where: { saleId: id } });
      for (const detail of details) {
        await tx.product.update({
          where: { id: detail.productId },
          data: { stock: { increment: detail.quantity } },
        });
      }
      await tx.saleDetail.deleteMany({ where: { saleId: id } });
      return tx.sale.delete({ where: { id } });
    });
  }
}

export default new SaleService();
