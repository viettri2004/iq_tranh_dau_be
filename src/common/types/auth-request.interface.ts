import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    sub: number;
    email?: string;
    name?: string;
  };
}
