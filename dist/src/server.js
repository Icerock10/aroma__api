"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const enums_1 = require("../common/enums");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = require("../routes/userRoutes");
const db_1 = require("../config/db");
const productsRouter_1 = require("../routes/productsRouter");
const errorHandler_1 = require("../middlewares/errorHandler");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(enums_1.UsersPath.ROOT, userRoutes_1.userRouter);
app.use(enums_1.ProductsPath.ROOT, productsRouter_1.productsRouter);
app.use(errorHandler_1.apiErrorHandler);
const port = process.env.PORT || 5000;
function startApp() {
    app.listen(port, () => {
        (0, db_1.connectDb)().then(() => {
            console.log(`Express is listening at http://localhost:${port}`);
        });
    });
}
startApp();
//# sourceMappingURL=server.js.map