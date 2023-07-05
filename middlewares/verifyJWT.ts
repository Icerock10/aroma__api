import { jwtService } from '../services/jwt.service';
import { ErrorService } from '../services/error/error.service';
import { ResponseMessage } from '../common/enums/response-messages-enums';
import { BEARER_TOKEN } from '../common/constants/constants';
import { NextFunction, Response } from 'express';
import { CustomRequest } from '../common/interfaces/interfaces';
export const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader: string = req.headers.authorization;
  if (!authHeader?.startsWith(BEARER_TOKEN)) {
    next(ErrorService.unAuthorizedErr(ResponseMessage.TOKEN_NOT_VALID));
  }
  const accessToken = authHeader?.split(' ')[1];
  jwtService.verifyAccessToken(accessToken, next, req);
};
