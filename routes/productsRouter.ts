import express from 'express';
import { multerUploadToStorage } from './helpers/create-multer-storage';
import productController from '../controller/productController';
import { ProductRoutes } from '../common/enums/product-routes-enums';
import { SINGLE_IMAGE } from '../common/constants/constants';
export const productsRouter = express.Router();


productsRouter.route(ProductRoutes.ROOT).get(productController.getAll);
productsRouter.route(ProductRoutes.GET_MANY).get(productController.getSomePaginatedProducts);
productsRouter.route(ProductRoutes.UPLOAD).post(multerUploadToStorage.single(SINGLE_IMAGE), productController.upload);
productsRouter.route(ProductRoutes.GET_ONE).get(productController.getOne);
productsRouter.route(ProductRoutes.GET_MANY_BY_IDS).post(productController.getManyById);
