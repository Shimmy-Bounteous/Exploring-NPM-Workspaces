import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, VerifyErrors, VerifyOptions } from 'jsonwebtoken';
import UsersDB from '../models/user';
import mongoose from 'mongoose';

// Custom Type
import User from '../types/userType';

// Custom Runtypes
import { RequestBodyForSignup, RequestBodyForLogin } from '../types/runtypes';

// Sign-Up a new user
const signup = async (req: Request<{}, {}, User>, res: Response): Promise<Response | void> => {
    try {
        // Checking if req.body is of the expected type
        if (!RequestBodyForSignup.guard(req.body)) {
            return res.status(400).json({ success: false, message: 'Invalid Request Body' });
        }
        else {
            const { name, dob, phoneNo, email, password }: User = req.body;

            // check if existing user
            const existingUser: User | null = await UsersDB.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ success: false, message: 'Email already exists' });
            }
            else {
                // encrpyt the password
                bcrypt.hash(password, 10, async (err, hashedPassword: string) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    else {
                        // creating user
                        const newUser = await UsersDB.create({
                            _id: new mongoose.Types.ObjectId(),
                            name,
                            dob,
                            phoneNo,
                            email,
                            password: hashedPassword
                        });
                        console.log(newUser);
                        return res.status(201).json({ success: true, message: 'User created' });
                    }
                });
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

}

// login user
const login = async (req: Request<{}, {}, User>, res: Response): Promise<Response | void> => {
    try {
        if (!RequestBodyForLogin.guard(req.body)) {
            return res.status(400).json({ success: false, message: 'Invalid Request Body' });
        }
        else {
            const { email, password } = req.body;

            // Check if user exits
            const user: User | null = await UsersDB.findOne({ "email": email });
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid User Credentials' });
            }
            else {
                // validate password
                bcrypt.compare(password, user.password, (err, hash) => {
                    if (err || !hash) {
                        return res.status(401).json({ success: false, message: 'Invalid User Credentials' });
                    }
                    else {
                        const JWT_KEY = process.env.JWT_KEY;

                        if (!JWT_KEY) {
                            console.log('JWT_KEY not available!');
                            return res.status(500).json({ success: false, message: 'Server error. Please try again later.' })
                        }
                        else {
                            // Generating access token
                            const accessToken = jwt.sign(
                                {
                                    email: email
                                },
                                JWT_KEY,
                                { expiresIn: '1hr' }
                            );

                            // Generating refresh token
                            const refreshToken = jwt.sign(
                                {
                                    email: email
                                },
                                JWT_KEY,
                                { expiresIn: '2h' }
                            );

                            // Setting refresh token in response cookie
                            res.cookie('jwt', refreshToken,
                                {
                                    httpOnly: true,
                                    secure: true
                                });

                            // console.log();
                            return res.status(200).json({ success: true, message: 'Login Successfull', accessToken });
                        }
                    }
                });
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

// Generate new access token upon refresh token's expiry
const refresh = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        // If cookies and refresh token doesn't exist
        if (!req.cookies?.jwt) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const refreshToken = req.cookies.jwt;

        const JWT_KEY = process.env.JWT_KEY;
        if (!JWT_KEY) {
            console.log('JWT_KEY not available!');
            return res.status(500).json({ success: false, message: 'Server error. Please try again later.' })
        }
        else {
            const user = jwt.verify(refreshToken, JWT_KEY ? JWT_KEY?.toString() : "");
            console.log(user);

            jwt.verify(
                refreshToken, JWT_KEY, async (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
                    if (err) {
                        return res.status(403).json({ success: false, message: 'Invalid Refresh Token' });
                    }
                    if (typeof decoded != undefined) {
                        const accessToken = jwt.sign(
                            {
                                email: decoded,
                            },
                            JWT_KEY,
                            { expiresIn: '1hr' }
                        );
                        return res.status(201).json({ success: true, accessToken });
                    }
                }
            );
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export {
    signup,
    login,
    refresh
};