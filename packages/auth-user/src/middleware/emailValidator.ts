import { Request, Response, NextFunction } from 'express'

const validateEmail = (req: Request, res: Response, next: NextFunction): Response | void => {
    const email: string = req.body.email;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is missing' });
    }

    // regex to validate email
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid Email' });
    }
    next();
}

export default validateEmail;