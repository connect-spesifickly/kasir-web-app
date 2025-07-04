import prisma from "../prisma";
import { ResponseError } from "../helpers/error";

class StockAdjustmentService {
  async create({
    productId,
    userId,
    quantityChange,
    reason,
  }: {
    productId: string;
    userId: string;
    quantityChange: number;
    reason: string;
  }) {
    return prisma.$transaction(async (tx: typeof prisma) => {
      // 1. Ambil stok terakhir
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new ResponseError(404, "Product not found");
      const lastStock = product.stock;
      // 2. Buat log StockAdjustment
      const adjustment = await tx.stockAdjustment.create({
        data: {
          productId,
          userId,
          quantityChange,
          lastStock,
          reason,
        },
      });
      // 3. Update stok produk
      await tx.product.update({
        where: { id: productId },
        data: { stock: { increment: quantityChange } },
      });
      return adjustment;
    });
  }

  async getAll(query: any) {
    const { search, skip, take, startDate, endDate } = query;
    const filter: any = {};
    if (search) {
      filter.product = {
        productName: { contains: search, mode: "insensitive" },
      };
    }
    if (startDate && endDate) {
      filter.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    }
    return prisma.stockAdjustment.findMany({
      where: filter,
      skip: Number(skip) || 0,
      take: Number(take) || 100,
      include: { product: true, user: true },
    });
  }
}

export default new StockAdjustmentService();
