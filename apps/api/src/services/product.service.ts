import prisma from "../prisma";
import { ResponseError } from "../helpers/error";
import { Prisma } from "@prisma/client";
import { Product } from "../interfaces/product.interface";

class ProductService {
  async create(data: Product) {
    return prisma.product.create({ data });
  }

  async getAll(query: any) {
    const { search, skip, take } = query;
    const where: Prisma.ProductWhereInput = {
      isActive: true, // Filter utama untuk hanya produk aktif
    };

    if (search) {
      // Tambahkan kondisi pencarian jika ada
      where.OR = [
        { productName: { contains: search, mode: "insensitive" } },
        { productCode: { contains: search, mode: "insensitive" } },
      ];
    }

    // Lakukan dua query secara paralel untuk efisiensi maksimal
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: Number(skip) || 0,
        take: Number(take) || 10,
        orderBy: { productName: "asc" },
      }),
      prisma.product.count({ where }),
    ]);

    return { data: products, total };
  }
  async getById(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new ResponseError(404, "Product not found");
    return product;
  }

  async update(id: string, data: any) {
    const updateData: Prisma.ProductUpdateInput = {};
    if (data.productCode) updateData.productCode = data.productCode;
    if (data.productName) updateData.productName = data.productName;
    if (data.price) updateData.price = data.price;
    return prisma.product.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    // Soft delete: check if product is in sale_details
    const saleDetail = await prisma.saleDetail.findFirst({
      where: { productId: id },
    });
    if (saleDetail) {
      // Soft delete: set isActive to false (if field exists)
      throw new ResponseError(
        400,
        "Produk ini tidak bisa dihapus permanen karena memiliki riwayat penjualan. Harap gunakan fitur 'Nonaktifkan"
      );
    }
    return prisma.product.delete({ where: { id } });
  }

  async restock(
    id: string,
    {
      quantityAdded,
      newCostPrice,
    }: { quantityAdded: number; newCostPrice: number }
  ) {
    // Gunakan transaction untuk memastikan read dan write sedekat mungkin
    return prisma.$transaction(
      async (tx: {
        product: {
          findUnique: (arg0: { where: { id: string } }) => any;
          update: (arg0: {
            where: { id: string };
            data: { stock: { increment: number }; costPrice: number };
          }) => any;
        };
      }) => {
        const product = await tx.product.findUnique({ where: { id } });
        if (!product) throw new ResponseError(404, "Product not found");

        const currentStock = product.stock;
        const currentCostPrice = Number(product.costPrice);

        // Hindari pembagian dengan nol jika stok baru adalah 0
        const newStock = currentStock + quantityAdded;
        if (newStock <= 0) {
          // Handle kasus khusus ini, mungkin throw error atau set cost price jadi 0
          throw new ResponseError(400, "Stok baru tidak boleh 0 atau kurang.");
        }

        const newAvgCost =
          (currentStock * currentCostPrice + quantityAdded * newCostPrice) /
          newStock;
        // Gunakan operasi atomik 'increment' untuk update stok
        // Ini jauh lebih aman dari race condition daripada 'stock: newStock'
        return tx.product.update({
          where: { id },
          data: {
            stock: {
              increment: quantityAdded,
            },
            costPrice: newAvgCost,
          },
        });
      }
    );
  }
  async deactivate(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { stock: true },
    });
    if (!product) throw new ResponseError(404, "Product not found");
    if (product.stock !== 0)
      throw new ResponseError(400, "Stok harus 0 sebelum menonaktifkan produk");
    return prisma.product.update({ where: { id }, data: { isActive: false } });
  }
}

export default new ProductService();
