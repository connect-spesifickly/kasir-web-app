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
    return prisma.$transaction(
      async (tx: {
        product: {
          findUnique: (arg0: { where: { id: string } }) => any;
          update: (arg0: {
            where: { id: string };
            data: { stock: { increment: number } };
          }) => any;
        };
        stockAdjustment: {
          create: (arg0: {
            data: {
              productId: string;
              userId: string;
              quantityChange: number;
              lastStock: any;
              reason: string;
            };
          }) => any;
        };
      }) => {
        // 1. Ambil stok terakhir
        const product = await tx.product.findUnique({
          where: { id: productId },
        });
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
      }
    );
  }

  async getAll(query: any) {
    const { search, skip, take, startDate, endDate, orderBy, orderDirection } =
      query;
    const filter: any = {};
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    if (search) {
      // Filter ini sudah efisien
      filter.OR = [
        { product: { productName: { contains: search, mode: "insensitive" } } },
        { product: { productCode: { contains: search, mode: "insensitive" } } },
        { reason: { contains: search, mode: "insensitive" } }, // Bonus: cari juga di alasan
      ];
    }
    if (startDate && endDate) {
      filter.createdAt = { gte: startOfDay, lte: endOfDay };
    }

    // Sorting
    let order: any = { createdAt: "desc" };
    if (orderBy === "createdAt") {
      order = { createdAt: orderDirection === "asc" ? "asc" : "desc" };
    } else if (orderBy === "productName") {
      order = {
        product: { productName: orderDirection === "asc" ? "asc" : "desc" },
      };
    } else if (orderBy === "quantityChange") {
      order = { quantityChange: orderDirection === "asc" ? "asc" : "desc" };
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
            costPrice: true, // tambahkan agar frontend bisa akses harga modal
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: order,
    });
    // Ambil total data untuk pagination di frontend
    const total = await prisma.stockAdjustment.count({ where: filter });
    return { adjustments, total };
  }
}

export default new StockAdjustmentService();
