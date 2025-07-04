import prisma from "../prisma";
import { ResponseError } from "../helpers/error";
import { Prisma } from "../generated/prisma";

class ProductService {
  async create(data: any) {
    return prisma.product.create({ data });
  }

  async getAll(query: any) {
    // Support search and pagination
    const { search, skip, take } = query;
    const filter: any = {};
    if (search) {
      filter.productName = { contains: search, mode: "insensitive" };
    }
    return prisma.product.findMany({
      where: filter && { isActive: true }, // Assuming isActive is a field for soft delete
      skip: Number(skip) || 0,
      take: Number(take) || 10,
    });
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
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new ResponseError(404, "Product not found");
    // Weighted average cost
    const currentStock = product.stock;
    const currentCostPrice = Number(product.costPrice);
    const newStock = currentStock + quantityAdded;
    const newAvgCost =
      (currentStock * currentCostPrice + quantityAdded * newCostPrice) /
      newStock;
    return prisma.product.update({
      where: { id },
      data: { stock: newStock, costPrice: newAvgCost },
    });
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
