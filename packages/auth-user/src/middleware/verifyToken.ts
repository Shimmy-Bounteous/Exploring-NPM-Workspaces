// This file is not required for signup and login

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction): Response | void => {

    // extract authorization headers from request
    const authHeader = req.headers['authorization'];
    // getting token from auth headers if auth headers
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Missing Token' })
    }
    else {
        const JWT_KEY = process.env.JWT_KEY;

        if (!JWT_KEY) {
            console.log('JWT_KEY not available!');
            return res.status(500).json({ success: false, message: 'Server Error. Please try again later.' });
        }
        else {
            // verify token
            jwt.verify(token, JWT_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ succes: false, message: 'Invalid Token' });
                }
                // req._id = decoded?.id;
                next();
            });
        }
    }
}

export { verifyToken };