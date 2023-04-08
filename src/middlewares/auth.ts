import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string
    }
}

export interface DecodedToken extends JwtPayload {
    user: {
        id: string
    }
}

dotenv.config()

// Middleware function that extracts a JWT token from the Authorization header and verifies it
export default (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as DecodedToken
        req.user = decoded.user
        next()
    } catch (e) {
        console.error(e)
        res.status(403).json({ message: 'Invalid token' })
    }
}
