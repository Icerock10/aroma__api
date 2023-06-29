"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const productController_1 = __importDefault(require("../controller/productController"));
const enums_1 = require("../common/enums");
exports.productsRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.productsRouter.route('/').get(productController_1.default.getAll);
exports.productsRouter.route(enums_1.ProductsPath.GET_MANY).get(productController_1.default.getSomePaginatedProducts);
exports.productsRouter.route(enums_1.ProductsPath.UPLOAD).post(upload.single('image'), productController_1.default.upload);
exports.productsRouter.route(enums_1.ProductsPath.GET_ONE).get(productController_1.default.getOne);
exports.productsRouter.route(enums_1.ProductsPath.GET_MANY_BY_IDS).post(productController_1.default.getManyById);
//# sourceMappingURL=productsRouter.js.map