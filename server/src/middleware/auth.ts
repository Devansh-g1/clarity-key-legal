import { Request, Response, NextFunction } from 'express';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (getApps().length === 0) {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    initializeApp({
      credential: cert(serviceAccount as any),
    });
  } else {
    initializeApp({
      credential: applicationDefault(),
    });
  }
}

export interface AuthedRequest extends Request {
  user?: { uid: string; email?: string | null };
}

export const verifyFirebaseIdToken = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring('Bearer '.length)
    : undefined;

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email ?? null };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};





