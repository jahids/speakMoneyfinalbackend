import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = 'jahid404'; // Replace with your secret key

export interface User {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'student';
}

const verifyRole: RequestHandler = (req : any, res, next) => {
  const token = req.cookies['auth-token'];
  
  if (!token) {
    return res.status(401).json({ error: 'varify role problem' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey) as User;
    req.user = decodedToken;
    const role = req.user.role;
    if (role === 'admin') {
      next();
    } else {
      return res.status(403).json({ error: 'Access denied. You are not an admin.' });
    }

  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export default verifyRole;
