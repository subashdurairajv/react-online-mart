import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";


const JWT_SECRET : string = String(process.env.JWT_SECRET)


export class userController {
    static login = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ username, password });
        console.log(userRepository, user, 'Test1')

        if (user) {
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                JWT_SECRET,
                { expiresIn: '1h' } 
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
    }
}