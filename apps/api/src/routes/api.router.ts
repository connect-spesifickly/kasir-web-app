import { Router } from "express";
import { authRouter } from "./auth.router";
import { productRouter } from "./product.router";
import { saleRouter } from "./sale.router";
import { stockAdjustmentRouter } from "./stock-adjustment.router";
import { reportRouter } from "./report.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter());
apiRouter.use("/products", productRouter());
apiRouter.use("/sales", saleRouter());
apiRouter.use("/stock-adjustments", stockAdjustmentRouter());
apiRouter.use("/reports", reportRouter());

export default apiRouter;
