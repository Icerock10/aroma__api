import { ErrorCodes } from '../../common/enums/server-error-codes-enums';
class ErrorService {
  public code: number;
  public message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

  static badRequestErr(message: string) {
    return new ErrorService(ErrorCodes.BAD_REQUEST, message);
  }

  static unAuthorizedErr(message: string) {
    return new ErrorService(ErrorCodes.UNAUTHORIZED, message);
  }

  static forbiddenError(message: string) {
    return new ErrorService(ErrorCodes.FORBIDDEN, message);
  }

  static internalErr(message: string) {
    return new ErrorService(ErrorCodes.SERVER_ERROR, message);
  }
}

export { ErrorService };
