import { Router } from "express";
import { cartController } from "../controllers/cartController";
import { authenticateToken } from "../utils/auth";

const cartRoutes = Router();
cartRoutes.use(authenticateToken);
cartRoutes.post("/updateCart", cartController.checkout);

export default cartRoutes;