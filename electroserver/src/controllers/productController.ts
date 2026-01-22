import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Products } from "../entity/Products";


export class productController {
    static product = async (req: Request, res: Response) => {
        const productsRepository = AppDataSource.getRepository(Products);
        const products = await productsRepository.find();
        console.log(productsRepository, products, 'Test1')

        if (products) {
            // res.json({ success: true, message: "Logged in!" });
            res.json({
                success: true,
                message: "Fetched successfully!",
                data: products
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    }
}