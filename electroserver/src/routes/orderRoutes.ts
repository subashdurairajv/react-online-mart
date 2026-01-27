import { Router } from "express";
import { cartController } from "../controllers/cartController";
import { authenticateToken } from "../utils/auth";

const orderRoutes = Router();
orderRoutes.use(authenticateToken);
orderRoutes.get("/orders/:user_id", cartController.orderDetails);

export default orderRoutes;