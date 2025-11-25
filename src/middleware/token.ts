import jwt, {JwtPayload} from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, NotFoundError, UnauthorizedError } from './error';
// import { TokenResponse, UserCreationAttributes } from '../../../interface/auth/LoginAttributes';
const secretKey = 'yourSecretKey';
interface UserIProps {
    id?: number;
    name?: string;
    email?: string;
    role?: string
    status?:string
    permissions?: Record<string, string[]>;
    permissionsList?: string[];
    // Add other user properties as needed
}
interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}
const INACTIVITY_TIMEOUT = 1000000 * 1000; // 10 seconds
export const ACCESS_TOKEN = async (data: Partial<UserIProps>):Promise<TokenResponse>=>{
    const payload = {...data };

    const accessToken =  await jwt.sign(payload, secretKey, { expiresIn: '100000s' })
    const refreshToken = jwt.sign(payload, secretKey, { expiresIn: '100000s' });
    return { accessToken, refreshToken };
}

export const refreshTokenHandler = async (refreshToken: string) => {
    if (!refreshToken) {
      throw new ForbiddenError('Access denied. No token provided');
    }

  try {
    const payload = jwt.verify(refreshToken, secretKey);
    const  {dataValues} = payload as JwtPayload
    
    const newAccessToken = jwt.sign(dataValues, secretKey, { expiresIn: '10000s' });
    const newRefreshToken = jwt.sign(dataValues, secretKey, { expiresIn: '10000s' });
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
     throw new UnauthorizedError(`${error}`); 
  }
};


export const VERIFY_TOKEN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get access token from cookies
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ForbiddenError("Access denied. No token provided");
    }

    try {
      // Verify access token
      const decoded = jwt.verify(token, secretKey);
      (req as any).user = decoded; // attach user info to request
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Access token expired → check refresh token
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
          throw new NotFoundError("Refresh token missing");
        }

        // Optionally: verify refresh token and issue new access token here
        const { accessToken, refreshToken: newRefreshToken } = await refreshTokenHandler(refreshToken);
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 5 * 60 * 1000,
          sameSite: "strict",
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        (req as any).user = jwt.verify(accessToken, secretKey);
        return next();
      }

      throw new UnauthorizedError("Invalid token");
    }
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
};
