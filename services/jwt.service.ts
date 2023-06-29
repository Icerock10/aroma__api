import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ErrorService } from './error/error.service';
class Jwt {
  private _jwt_instance: typeof jwt;

  constructor() {
    this._jwt_instance = jwt;
  }

  generateAccessToken(email: string) {
    const expiresInOneWeek = 60 * 60 * 24 * 7;
    return this._jwt_instance.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: expiresInOneWeek,
    });
  }

  generateRefreshToken(email: string) {
    const expiresInOneWeek = 60 * 60 * 24 * 7;
    return this._jwt_instance.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: expiresInOneWeek,
    });
  }

  verifyRefreshToken(refreshToken, next) {
    return this._jwt_instance.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) next(ErrorService.unAuthorizedErr('Token is not valid or expired'));
        const foundUser = await User.findOne({ email: decoded.email });
        if (!foundUser) next(ErrorService.unAuthorizedErr('User was not found'));
        return this.generateAccessToken(foundUser.email);
      },
    );
  }

  verifyAccessToken(accessToken, next, req) {
    return this._jwt_instance.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) next(ErrorService.forbiddenError('You were logged out'));
        req.email = decoded.email;
        next();
      },
    );
  }
}

const jwtService = new Jwt();

export { jwtService };
