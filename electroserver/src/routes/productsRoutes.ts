import { Router } from "express";
import { productController } from "../controllers/productController";
import { authenticateToken } from "../utils/auth";

const productsRouter = Router();
productsRouter.use(authenticateToken);
productsRouter.get("/fetchProducts", productController.product);

export default productsRouter;