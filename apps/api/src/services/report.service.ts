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
    const result: [{ total_profit: number | bigint | null }] =
      await prisma.$queryRaw`
      SELECT 
        SUM(("price_at_sale" - "cost_at_sale") * quantity) as total_profit
      FROM 
        "sale_details"
      WHERE 
        "sale_id" IN (
          SELECT id FROM "sales" WHERE "transaction_time" BETWEEN ${startOfDay} AND ${endOfDay}
        );
    `;

    // $queryRaw mengembalikan array, kita ambil elemen pertama
    let totalProfit = result[0]?.total_profit || 0;
    if (typeof totalProfit === "bigint") totalProfit = Number(totalProfit);
    // Pastikan hasilnya adalah angka yang valid
    return { totalProfit };
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

    const result: [{ total_loss_value: number | bigint | null }] =
      await prisma.$queryRaw`
    SELECT
      SUM(ABS(sa."quantity_change") * p."cost_price") as total_loss_value
    FROM
      "stock_adjustments" as sa
    JOIN
      "products" as p ON sa."product_id" = p.id
    WHERE
      sa."created_at" BETWEEN ${startOfDay} AND ${endOfDay}
      AND sa."quantity_change" < 0;
  `;

    let totalLossValue = result[0]?.total_loss_value || 0;
    if (typeof totalLossValue === "bigint")
      totalLossValue = Number(totalLossValue);
    return { totalLossValue };
  }

  async dailyTransactionsReport({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) {
    // Ambil transaksi per hari, omzet, profit, loss, dan jumlah transaksi
    const result: Array<{
      date: string;
      revenue: number | bigint;
      profit: number | bigint;
      loss: number | bigint;
      transactionCount: number | bigint;
    }> = await prisma.$queryRaw`
      WITH sales_per_day AS (
        SELECT
          DATE("transaction_time") AS date,
          SUM("total_amount") AS revenue,
          COUNT(id) AS transaction_count
        FROM "sales"
        WHERE "transaction_time" BETWEEN ${startDate}::date AND ${endDate}::date + INTERVAL '1 day' - INTERVAL '1 second'
        GROUP BY DATE("transaction_time")
      ),
      profit_per_day AS (
        SELECT
          DATE(s."transaction_time") AS date,
          SUM((sd."price_at_sale" - sd."cost_at_sale") * sd.quantity) AS profit
        FROM "sale_details" sd
        JOIN "sales" s ON sd."sale_id" = s.id
        WHERE s."transaction_time" BETWEEN ${startDate}::date AND ${endDate}::date + INTERVAL '1 day' - INTERVAL '1 second'
        GROUP BY DATE(s."transaction_time")
      ),
      loss_per_day AS (
        SELECT
          DATE(sa."created_at") AS date,
          SUM(ABS(sa."quantity_change") * p."cost_price") AS loss
        FROM "stock_adjustments" sa
        JOIN "products" p ON sa."product_id" = p.id
        WHERE sa."created_at" BETWEEN ${startDate}::date AND ${endDate}::date + INTERVAL '1 day' - INTERVAL '1 second'
          AND sa."quantity_change" < 0
        GROUP BY DATE(sa."created_at")
      )
      SELECT
        d.date,
        COALESCE(s.revenue, 0) AS revenue,
        COALESCE(p.profit, 0) AS profit,
        COALESCE(l.loss, 0) AS loss,
        COALESCE(s.transaction_count, 0) AS "transactionCount"
      FROM (
        SELECT generate_series(${startDate}::date, ${endDate}::date, INTERVAL '1 day') AS date
      ) d
      LEFT JOIN sales_per_day s ON d.date = s.date
      LEFT JOIN profit_per_day p ON d.date = p.date
      LEFT JOIN loss_per_day l ON d.date = l.date
      ORDER BY d.date ASC;
    `;
    // Konversi BigInt ke Number
    return result.map((row) => ({
      ...row,
      revenue:
        typeof row.revenue === "bigint" ? Number(row.revenue) : row.revenue,
      profit: typeof row.profit === "bigint" ? Number(row.profit) : row.profit,
      loss: typeof row.loss === "bigint" ? Number(row.loss) : row.loss,
      transactionCount:
        typeof row.transactionCount === "bigint"
          ? Number(row.transactionCount)
          : row.transactionCount,
    }));
  }
}

export default new ReportService();
