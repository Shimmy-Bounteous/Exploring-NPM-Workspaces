import { Request, Response, NextFunction } from 'express';
import { Parameters } from '../types/runtypes';
import { User, logRequest } from '@npm-workspaces/authuser';
import { UsersDB } from '@npm-workspaces/authuser';

const getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        if (!Parameters.guard(req.params)) {
            return res.status(400).json({ success: false, message: 'Invalid Parameters' });
        }
        else {

            const _id = req.params._id;
            const user: User | null = await UsersDB.findOne({ _id });
            if (!user) {
                return res.status(400).json({ success: false, message: 'Invalid User ID' });
            }
            else {
                console.log(user);
                return res.status(200).json({ success: true, user });
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export { getUser };