import express from 'express';
import multer from 'multer';
import productController from '../controller/productController';
import { ProductsPath } from '../common/enums';
export const productsRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

productsRouter.route('/').get(productController.getAll);
productsRouter.route(ProductsPath.GET_MANY).get(productController.getSomePaginatedProducts);
productsRouter.route(ProductsPath.UPLOAD).post(upload.single('image'), productController.upload);
productsRouter.route(ProductsPath.GET_ONE).get(productController.getOne);
productsRouter.route(ProductsPath.GET_MANY_BY_IDS).post(productController.getManyById);
