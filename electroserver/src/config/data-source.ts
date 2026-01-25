import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Products } from "../entity/Products";
import * as dotenv from "dotenv";
import { CartOrder } from "../entity/Cart";
dotenv.config();

export const AppDataSource = new DataSource({
   type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Set to false in production!
    logging: true,
    entities: [User, Products, CartOrder],
    subscribers: [],
    migrations: [],
});