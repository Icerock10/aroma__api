
class ErrorService {
  public code: number;
  public message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

  static badRequestErr(message: string) {
    return new ErrorService(400, message);
  }

  static unAuthorizedErr(message: string) {
    return new ErrorService(401, message);
  }

  static forbiddenError(message: string) {
    return new ErrorService(403, message);
  }

  static internalErr(message: string) {
    return new ErrorService(500, message);
  }
}

export { ErrorService };
