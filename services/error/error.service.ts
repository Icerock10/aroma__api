class ErrorService {
  public code;
  public message;

  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequestErr(message) {
    return new ErrorService(400, message);
  }

  static unAuthorizedErr(message) {
    return new ErrorService(401, message);
  }

  static forbiddenError(message) {
    return new ErrorService(403, message);
  }

  static internalErr(message) {
    return new ErrorService(500, message);
  }
}

export { ErrorService };
