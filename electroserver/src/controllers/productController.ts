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

    static updateProducts = async (req: Request, res: Response) => {
        const { products } = req.body;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            for (const item of products) {
                // Update each product's quantity atomically
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(Products)
                    .set({
                        product_quantity: () => `product_quantity - ${item.count}`
                    })
                    .where("id = :id", { id: item.id })
                    .execute();
            }

            // Commit all changes at once
            await queryRunner.commitTransaction();

            return res.status(200).json({ success: true, message: "Inventory updated successfully" });

        } catch (error) {
            // If anything fails, undo all updates
            await queryRunner.rollbackTransaction();
            console.error("Bulk Update Error:", error);
            return res.status(500).json({ success: false, message: "Failed to update inventory" });

        } finally {
            // Release the database connection
            await queryRunner.release();
        }
    }

    static productDetail = async (req: Request, res: Response) => {
        const { id } = req.params
        const productsRepository = AppDataSource.getRepository(Products);
        const productInfo = await productsRepository.findBy({ id: Number(id) });

        if (productInfo) {
            // res.json({ success: true, message: "Logged in!" });
            res.json({
                success: true,
                message: "Fetched successfully!",
                data: productInfo
            });
        } else {
            res.status(401).json({ success: false, message: "No product found" });
        }
    }
}