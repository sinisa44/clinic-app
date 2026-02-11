import { Request, Response } from 'express';

import * as UserService from '../services/user.service';

export const getPatients = async (req: Request, res: Response) => {
  try {
    const user = (req.session as any).user;

    if (!user || user.role !== 'doctor')
      return res.status(403).send('Forbidden');

    const patients = await UserService.getPatients();
    res.json(patients);
  } catch (error) {
    res.status(500).json(error);
  }
};
