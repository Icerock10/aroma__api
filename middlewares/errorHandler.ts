import { ErrorService } from '../services/error/error.service';
import { ResponseMessage } from '../common/enums/response-messages-enums';
import { NextFunction, Request, Response } from 'express';

function apiErrorHandler(err: ErrorService, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ErrorService) {
    res.status(err.code).json({ message: err.message });
    return;
  }
  res.status(500).json(ResponseMessage.SOMETHING_WENT_WRONG);
}

export { apiErrorHandler };
