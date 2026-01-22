import { Router } from "express";
import { userController } from "../controllers/userController";

const userRouter = Router();

userRouter.post("/login", userController.login);

export default userRouter;