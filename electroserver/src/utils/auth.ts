import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET : string = String(process.env.JWT_SECRET);

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Get token from the 'Authorization' header (Format: Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach the user data (from the JWT payload) to the request object
        (req as any).user = decoded; 
        
        next(); // Move to the next function (the actual route)
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};