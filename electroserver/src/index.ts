import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet'
import jwt from 'jsonwebtoken';
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Products } from "./entity/Products";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(helmet())
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
})); // Allows your React app to talk to this server

const JWT_SECRET : string = String(process.env.JWT_SECRET)

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected!");

        // Login Route
        app.post("/api/login", async (req: Request, res: Response) => {
            const { username, password } = req.body;
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ username, password });
            console.log(userRepository, user, 'Test1')

            if (user) {
                const token = jwt.sign(
                    { userId: user.id, username: user.username },
                    JWT_SECRET,
                    { expiresIn: '1h' } // Token expires in 1 hour
                );
                // res.json({ success: true, message: "Logged in!" });
                res.json({
                    success: true,
                    message: "Logged in!",
                    token: token,
                    user: { id: user.id, username: user.username }
                });
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        });

        app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch((error) => console.log("TypeORM connection error: ", error));