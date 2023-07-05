import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { EXPIRES_IN_ONE_WEEK } from '../common/constants/constants';
import { ResponseMessage } from '../common/enums/response-messages-enums';
import { ErrorService } from './error/error.service';
import { NextFunction } from 'express';
import { CustomRequest } from '../common/interfaces/interfaces';

class Jwt {
  private _jwt_instance: typeof jwt;

  constructor() {
    this._jwt_instance = jwt;
  }

  generateAccessToken(email: string) {
    return this._jwt_instance.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: EXPIRES_IN_ONE_WEEK,
    });
  }

  generateRefreshToken(email: string) {
    return this._jwt_instance.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: EXPIRES_IN_ONE_WEEK,
    });
  }

  verifyRefreshToken(refreshToken: string, next: NextFunction) {
    return this._jwt_instance.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err: Error, decoded) => {
        if (err) next(ErrorService.unAuthorizedErr(ResponseMessage.TOKEN_NOT_VALID));
        const foundUser = await User.findOne({ email: decoded.email });
        if (!foundUser) next(ErrorService.unAuthorizedErr(ResponseMessage.USER_NOT_FOUND));
        return this.generateAccessToken(foundUser.email);
      },
    );
  }

  verifyAccessToken(accessToken: string, next: NextFunction, req: CustomRequest) {
    return this._jwt_instance.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) next(ErrorService.forbiddenError(ResponseMessage.LOGGED_OUT));
        req.email = decoded.email;
        next();
      },
    );
  }
}

const jwtService = new Jwt();

export { jwtService };
