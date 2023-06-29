import { jwtService } from '../services/jwt.service';
import { ErrorService } from '../services/error/error.service';
export const verifyJWT = (req, res, next) => {
  const authHeader: string = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(ErrorService.unAuthorizedErr('Access token was not found or invalid'));
  }
  const accessToken = authHeader?.split(' ')[1];
  jwtService.verifyAccessToken(accessToken, next, req);
};
