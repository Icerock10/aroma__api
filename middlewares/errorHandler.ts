import { ErrorService } from '../services/error/error.service';

function apiErrorHandler(err, req, res) {
  if (err instanceof ErrorService) {
    res.status(err.code).json({ message: err.message });
    return;
  }
  res.status(500).json('Something went wrong...');
}

export { apiErrorHandler };
