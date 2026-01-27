import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { CartOrder } from "../entity/Cart";
import { Products } from "../entity/Products";



export class cartController {
    static updateCart = async (req: Request, res: Response) => {

        try {
            const cartRepository = AppDataSource.getRepository(CartOrder);
            const { cart_id, user_id, total_cost, products } = req.body;

            const newOrder = cartRepository.create({
                cart_id: cart_id,
                user_id: user_id,
                total_cost: total_cost,
                products: products
            });

            await cartRepository.save(newOrder);
            return res.status(201).json({
                success: true,
                message: "Order placed successfully!",
                orderId: newOrder.cart_id
            });

        } catch (error: any) {
            console.error("Database Error:", error);

            return res.status(500).json({
                success: false,
                message: "An internal error occurred while saving your order."
            });
        }
    }

    static orderDetails = async (req: Request, res: Response) => {
        const { user_id } = req.params
        console.log('testuser', req)
        try {
            const cartRepository = AppDataSource.getRepository(CartOrder);
            

            const orderInfo = await cartRepository.find({
            where: { 
                user_id: Number(user_id) 
            },
            order: {
                // Assuming you have a createdAt column, otherwise use cart_id
                cart_id: "DESC" 
            }
        });

            if (orderInfo) {
            res.json({
                success: true,
                message: "Order Details Fetched successfully!",
                data: orderInfo
            });
        } else {
            res.status(401).json({ success: false, message: "No orders found" });
        }

        } catch (error: any) {
            console.error("Database Error:", error);

            return res.status(500).json({
                success: false,
                message: "An internal error occurred while fetching your order."
            });
        }
    }


    static checkout = async (req: Request, res: Response) => {
        const { cart_id, user_id, products, total_cost } = req.body;

        // Create a QueryRunner to control the transaction
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // STEP 1: Save the Order record
            const newOrder = queryRunner.manager.create(CartOrder, {
                cart_id,
                user_id,
                products, // The array of items
                total_cost
            });
            await queryRunner.manager.save(newOrder);

            // STEP 2: Loop through products and update stock
            for (const item of products) {
                // Atomic decrement to prevent race conditions
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(Products)
                    .set({
                        product_quantity: () => `CAST(product_quantity AS INTEGER) - ${item.count}`
                    })
                    .where("id = :id", { id: item.id })
                    .execute();
            }

            // If we reach here, both steps worked. Commit to DB!
            await queryRunner.commitTransaction();

            res.status(200).json({ success: true, message: "Order placed successfully!" });

        } catch (error) {
            // If ANY step fails, UNDO everything done inside this transaction
            await queryRunner.rollbackTransaction();
            console.error("Transaction Error:", error);
            res.status(500).json({ success: false, message: "Checkout failed. Please try again." });

        } finally {
            // Always release the connection
            await queryRunner.release();
        }
    }
}