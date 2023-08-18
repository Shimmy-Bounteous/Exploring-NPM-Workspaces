import { Request, Response, NextFunction } from 'express';

const logRequest = (req: Request, res: Response, next: NextFunction): void => {
    console.log(`\nRequest Method: ${req.method} \t Request URL: ${req.url}`);
    if (req.method === "PATCH" || req.method === "POST") {
        console.log(`Request Body:`);
        console.log(req.body);
    }
    next();
}

export default logRequest;