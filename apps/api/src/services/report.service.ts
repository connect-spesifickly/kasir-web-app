import prisma from "../prisma";

class ReportService {
  async salesReport({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0); // Pastikan mulai dari awal hari

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999); // Pastikan berakhir di akhir hari

    const result = await prisma.sale.aggregate({
      _sum: { totalAmount: true },
      _count: { id: true },
      where: {
        transactionTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });
    return {
      totalOmzet: result._sum.totalAmount || 0,
      jumlahTransaksi: result._count.id || 0,
    };
  }

  async profitReport({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) {
    // Pastikan tanggal diformat dengan benar untuk keamanan dan fungsionalitas
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Menggunakan $queryRaw untuk menulis SQL murni
    // `Prisma.sql` digunakan untuk mencegah SQL Injection
    const result: [{ total_profit: number | null }] = await prisma.$queryRaw`
      SELECT 
        SUM(("priceAtSale" - "costAtSale") * quantity) as total_profit
      FROM 
        "sale_details"
      WHERE 
        "saleId" IN (
          SELECT id FROM "sales" WHERE "transactionTime" BETWEEN ${startOfDay} AND ${endOfDay}
        );
    `;

    // $queryRaw mengembalikan array, kita ambil elemen pertama
    const totalProfit = result[0]?.total_profit || 0;
    // Pastikan hasilnya adalah angka yang valid
    return { totalProfit: Number(totalProfit) };
  }

  async lossesReport({
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

    const result: [{ total_loss_value: number | null }] =
      await prisma.$queryRaw`
    SELECT
      SUM(ABS(sa."quantityChange") * p."costPrice") as total_loss_value
    FROM
      "stock_adjustments" as sa
    JOIN
      "products" as p ON sa."productId" = p.id
    WHERE
      sa."createdAt" BETWEEN ${startOfDay} AND ${endOfDay}
      AND sa."quantityChange" < 0;
  `;

    const totalLossValue = result[0]?.total_loss_value || 0;

    return { totalLossValue: Number(totalLossValue) };
  }
}

export default new ReportService();
