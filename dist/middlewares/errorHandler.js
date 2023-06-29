"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiErrorHandler = void 0;
const error_service_1 = require("../services/error/error.service");
function apiErrorHandler(err, req, res) {
    if (err instanceof error_service_1.ErrorService) {
        res.status(err.code).json({ message: err.message });
        return;
    }
    res.status(500).json('Something went wrong...');
}
exports.apiErrorHandler = apiErrorHandler;
//# sourceMappingURL=errorHandler.js.map