import type { Request } from 'express';

export interface JwtUser {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtUser;
}