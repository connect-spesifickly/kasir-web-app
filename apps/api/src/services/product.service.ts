import prisma from "../prisma";
import { ResponseError } from "../helpers/error";
import { Prisma } from "@prisma/client";
import { Product } from "../interfaces/product.interface";

class ProductService {
  async create(data: any) {
    let categoryId = data.categoryId;
    if (!categoryId && data.categoryName) {
      // Buat kategori baru
      const category = await prisma.category.create({
        data: { name: data.categoryName },
      });
      categoryId = category.id;
    }
    // Hapus categoryName agar tidak error di prisma
    const { categoryName, ...productData } = data;
    return prisma.product.create({ data: { ...productData, categoryId } });
  }

  async getAll(query: any) {
    const {
      search,
      skip,
      take,
      orderBy,
      orderDirection,
      isActive,
      stockGreaterThan,
      categoryId,
    } = query;
    const where: Prisma.ProductWhereInput = {};

    if (typeof isActive !== "undefined") {
      where.isActive = isActive === "true" || isActive === true;
    }
    if (typeof stockGreaterThan !== "undefined") {
      where.stock = { gt: Number(stockGreaterThan) };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { productName: { contains: search, mode: "insensitive" } },
        { productCode: { contains: search, mode: "insensitive" } },
      ];
    }

    let order: any = { productName: "asc" };
    if (orderBy === "stock") {
      order = { stock: orderDirection === "desc" ? "desc" : "asc" };
    } else if (orderBy === "productName") {
      order = { productName: orderDirection === "desc" ? "desc" : "asc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: Number(skip) || 0,
        take: Number(take) || 10,
        orderBy: [{ isActive: "desc" }, order],
        include: {
          category: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Map agar response ada categoryName
    const mappedProducts = products.map((p: any) => ({
      ...p,
      categoryName: p.category?.name || null,
    }));
    return { data: mappedProducts, total };
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
    if (data.minStock !== undefined) updateData.minStock = data.minStock;

    let categoryId = data.categoryId;
    if (!categoryId && data.categoryName) {
      // Buat kategori baru
      const category = await prisma.category.create({
        data: { name: data.categoryName },
      });
      categoryId = category.id;
    }
    if (categoryId) updateData.category = { connect: { id: categoryId } };

    return prisma.product.update({ where: { id }, data: updateData });
  }

  async activate(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new ResponseError(404, "Product not found");
    return prisma.product.update({ where: { id }, data: { isActive: true } });
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

  async getLowStockProducts() {
    return await prisma.$queryRaw`
    SELECT 
      id, 
      "product_name" AS "productName", 
      "product_code" AS "productCode", 
      stock, 
      "min_stock" AS "minStock"
    FROM "products"
    WHERE "is_active" = true 
      AND "min_stock" IS NOT NULL 
      AND stock <= "min_stock"
    ORDER BY "product_name" ASC
  `;
  }

  async getCategories() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  async createCategory(name: string) {
    if (!name) throw new ResponseError(400, "Nama category harus diisi");
    return prisma.category.create({ data: { name } });
  }
}

export default new ProductService();
