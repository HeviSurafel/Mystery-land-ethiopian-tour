import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export interface UserPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat?: number;
  exp?: number;
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return null;
    
    return verifyToken(token);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth(role?: string): Promise<UserPayload> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  if (role && user.role !== role) {
    throw new Error('Unauthorized: Insufficient permissions');
  }
  
  return user;
}

// For API routes using NextRequest
export async function getCurrentUserFromRequest(request: NextRequest): Promise<UserPayload | null> {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) return null;
    
    return verifyToken(token);
  } catch (error) {
    console.error('Error getting current user from request:', error);
    return null;
  }
}

export async function requireAuthFromRequest(request: NextRequest, role?: string): Promise<UserPayload> {
  const user = await getCurrentUserFromRequest(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  if (role && user.role !== role) {
    throw new Error('Unauthorized: Insufficient permissions');
  }
  
  return user;
}