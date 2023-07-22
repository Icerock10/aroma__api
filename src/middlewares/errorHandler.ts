import { ErrorService } from '../services/error/error.service';
import { ResponseMessage } from '../common/enums/response-messages-enums';
import { Request, Response } from 'express';
import { ErrorCodes } from '../common/enums/server-error-codes-enums';

function apiErrorHandler(err: ErrorService, req: Request, res: Response) {
  if (err instanceof ErrorService) {
    res.status(err.code).json({ message: err.message });
    return;
  }
  res.status(ErrorCodes.SERVER_ERROR).json(ResponseMessage.SOMETHING_WENT_WRONG);
}

export { apiErrorHandler };
