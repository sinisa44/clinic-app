import {Request, Response} from 'express';
import {User} from '../models/User';

export const login = async (req:Request, res:Response) => {
    const {username, password, timezone} = req.body;

    const user = await User.findOne({username, password});

    if (!user) return res.status(401).send('Unauthorized');

    user.timezone = timezone || 'UTC';
    await user.save();

    (req.session as any).user = user;

    res.json({user});
}
export const me = (req:Request, res:Response) => {
    if(!(req.session as any).user) return res.status(401).send('Not auth');
    res.json({user: (req.session as any).user});
}
export const logout = (req:Request, res:Response) => {
    req.session.destroy(() => res.send('Logged out'));
}