"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Products_1 = require("../models/Products");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const error_service_1 = require("../services/error/error.service");
const s3_service_1 = __importDefault(require("../services/aws-s3/s3.service"));
function getPaginatedResults(page, limit, products) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 6;
    const totalCount = products.length;
    const totalPages = Math.ceil(totalCount / limitNumber);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;
    const paginatedProducts = products.slice(startIndex, endIndex);
    return {
        totalPages,
        paginatedProducts,
        pageNumber,
        endIndex,
    };
}
class Product {
    constructor() {
        this.upload = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.file || !req.body)
                next(error_service_1.ErrorService.badRequestErr('File was not uploaded, or bad format'));
            const { category, title, subTitle, description, price, productProfile, burnTime, indication } = req.body;
            const { originalname, mimetype, buffer } = req.file;
            const isDuplicate = yield Products_1.Products.findOne({ imageName: originalname });
            if (isDuplicate)
                return next(error_service_1.ErrorService.badRequestErr('This image already exists'));
            yield s3_service_1.default._upload(originalname, buffer, mimetype);
            const product = yield Products_1.Products.create({
                imageName: originalname,
                category,
                title,
                subTitle,
                description,
                price,
                productProfile,
                burnTime,
                indication,
            });
            res.json(product);
        }));
        this.getAll = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const products = yield Products_1.Products.find({});
            const productsWithImages = yield s3_service_1.default._getImages(products);
            res.send(productsWithImages);
        }));
        this.getSomePaginatedProducts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { category, page, limit } = req.query;
            const products = !category ? yield Products_1.Products.find({}) : yield Products_1.Products.find({ category });
            if (!products.length)
                next(error_service_1.ErrorService.badRequestErr('Category is invalid'));
            const { paginatedProducts, pageNumber, totalPages, endIndex } = getPaginatedResults(page, limit, products);
            if (!category && Number(page) > totalPages)
                next(error_service_1.ErrorService.badRequestErr('There is no next page'));
            const paginatedProductsWithImages = yield s3_service_1.default._getImages(paginatedProducts);
            if (!paginatedProductsWithImages.length)
                next(error_service_1.ErrorService.internalErr('Something went wrong with AWS...'));
            const response = {
                paginatedProductsWithImages,
                pageNumber,
                totalPages,
                endIndex,
                limit,
            };
            res.json(response);
        }));
        this.getOne = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { category, id } = req.query;
            const product = yield Products_1.Products.find({ category, _id: id });
            if (!product)
                return next(error_service_1.ErrorService.badRequestErr('Product was not found'));
            const productWithImage = yield s3_service_1.default._getSingleProduct(product);
            if (!productWithImage.length)
                return next(error_service_1.ErrorService.internalErr('Something wrong with AWS service...'));
            res.json(productWithImage);
        }));
        this.getManyById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const products = yield Products_1.Products.find({}).where('_id').in(req.body).exec();
            if (!products.length)
                return next(error_service_1.ErrorService.internalErr('Products were not found...'));
            const productsWithUrls = yield s3_service_1.default._getImages(products);
            res.json(productsWithUrls);
        }));
    }
}
exports.default = new Product();
//# sourceMappingURL=productController.js.map