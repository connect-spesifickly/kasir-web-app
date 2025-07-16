import prisma from "../prisma";
import { ResponseError } from "../helpers/error";
import { Product } from "../interfaces/product.interface";

class SaleService {
  async create({ cart }: { cart: { productId: string; quantity: number }[] }) {
    // 1. Ambil semua ID produk dari keranjang
    const productIds = cart.map((item) => item.productId);
    // 2. Lakukan SATU kali query untuk mendapatkan semua data produk yang relevan
    const productsInCart = await prisma.product.findMany({
      where: {
        id: { in: productIds }, // Gunakan 'in' untuk mengambil banyak produk sekaligus
      },
    });
    // Untuk akses cepat nanti, ubah array menjadi Map (Object)
    const productMap = new Map<string, Product>(
      productsInCart.map((p) => [
        p.id as string,
        {
          ...p,
          // Ensure minStock is undefined if null, to match Product interface
          minStock: p.minStock === null ? undefined : p.minStock,
        } as Product,
      ])
    );
    return prisma.$transaction(async (tx: any) => {
      // 3. Validasi Stok (Loop pertama dan satu-satunya untuk validasi)
      for (const item of cart) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new ResponseError(
            404,
            `Produk tidak ditemukan: ${item.productId}`
          );
        }
        if (product.stock < item.quantity) {
          throw new ResponseError(
            400,
            `Stok tidak cukup untuk produk: ${product.productName}`
          );
        }
      }
      // 4. Hitung Total Amount (Tidak perlu cek if !product lagi)
      const totalAmount = cart.reduce((total, item) => {
        const product = productMap.get(item.productId)!; // '!' memberitahu TypeScript bahwa kita yakin ini ada
        return total + Number(product.price) * item.quantity;
      }, 0);
      // 5. CREATE 'Sale'
      const sale = await tx.sale.create({ data: { totalAmount } });
      // 6. Siapkan data (Tidak perlu cek if !product lagi)
      const saleDetailCreates = cart.map((item) => {
        const product = productMap.get(item.productId)!;
        return {
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtSale: product.price,
          costAtSale: product.costPrice,
        };
      });
      const productUpdates = cart.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      );
      // 7. Lakukan penulisan massal
      await tx.saleDetail.createMany({ data: saleDetailCreates });
      await Promise.all(productUpdates);
      // 8. Ambil data nota final
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
          OR: [
            {
              product: {
                productName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              product: {
                productCode: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      };
    }
    if (startDate && endDate) {
      filter.transactionTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    const sales = await prisma.sale.findMany({
      where: filter,
      skip: Number(skip) || 0,
      take: Number(take) || 6,
      include: {
        _count: {
          select: { saleDetails: true },
        },
      },
      orderBy: {
        transactionTime: "desc",
      },
    });

    const transformedSales = sales.map(
      (sale: {
        id: any;
        transactionTime: any;
        totalAmount: any;
        _count: { saleDetails: any };
      }) => ({
        id: sale.id,
        transactionTime: sale.transactionTime,
        totalAmount: sale.totalAmount,
        totalItems: sale._count.saleDetails,
      })
    );
    const totalSales = await prisma.sale.count({ where: filter });
    return { sales: transformedSales, total: totalSales };
  }

  async getById(id: string) {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { saleDetails: true },
    });
    if (!sale) throw new ResponseError(404, "Sale not found");
    return sale;
  }

  async salesDetailReport({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Ambil semua sale beserta detail dan produk
    const sales = await prisma.sale.findMany({
      where: {
        transactionTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        saleDetails: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { transactionTime: "asc" },
    });

    // Flatten ke bentuk per item
    const details = sales.flatMap((sale) =>
      sale.saleDetails.map((detail) => ({
        transactionDate: sale.transactionTime,
        invoiceNumber: sale.id,
        productCode: detail.product?.productCode || "",
        productName: detail.product?.productName || "",
        quantity: detail.quantity,
        priceAtSale: detail.priceAtSale,
        costAtSale: detail.costAtSale,
        subtotal: Number(detail.priceAtSale) * detail.quantity,
        totalProfit:
          (Number(detail.priceAtSale) - Number(detail.costAtSale)) *
          detail.quantity,
      }))
    );

    return details;
  }
}

export default new SaleService();
