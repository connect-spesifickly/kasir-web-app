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
      // Filter ini sudah efisien
      filter.OR = [
        { product: { productName: { contains: search, mode: "insensitive" } } },
        { product: { productCode: { contains: search, mode: "insensitive" } } },
        { reason: { contains: search, mode: "insensitive" } }, // Bonus: cari juga di alasan
      ];
    }
    if (startDate && endDate) {
      filter.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    // Ambil daftar data yang sudah dioptimalkan
    const adjustments = await prisma.stockAdjustment.findMany({
      where: filter,
      skip: Number(skip) || 0,
      take: Number(take) || 10,
      include: {
        product: {
          select: {
            productName: true,
            productCode: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // Ambil total data untuk pagination di frontend
    const total = await prisma.stockAdjustment.count({ where: filter });
    return { adjustments, total };
  }
}

export default new StockAdjustmentService();
