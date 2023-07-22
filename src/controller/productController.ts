import { Products } from '../models/Products';
import asyncHandler from 'express-async-handler';
import { ErrorService } from '../services/error/error.service';
import { Product } from '../common/interfaces/interfaces';
import S3Service from '../services/aws-s3/s3.service';
import { ResponseMessage } from '../common/enums/response-messages-enums';
import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../common/interfaces/interfaces';
import { DATABASE_ID_PATH } from '../common/constants/constants';

class productController {
  upload = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.file || !req.body)
      return next(ErrorService.badRequestErr(ResponseMessage.FILE_OR_PRODUCT_NOT_UPLOADED));
    const {
      category,
      title,
      subTitle,
      description,
      price,
      productProfile,
      burnTime,
      indication,
      capacity,
    } = req.body;
    const { originalname, mimetype, buffer } = req.file;

    const isDuplicate = await Products.findOne({ imageName: originalname });
    if (isDuplicate) return next(ErrorService.badRequestErr(ResponseMessage.IMAGE_ALREADY_EXISTS));

    await S3Service._upload(originalname, buffer, mimetype);

    const product: Product = await Products.create({
      imageName: originalname,
      category,
      title,
      subTitle,
      description,
      price,
      productProfile,
      burnTime,
      indication,
      capacity,
    });
    res.json(product);
  });
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const products: Product[] = await Products.find({});
    const productsWithImages: Product[] = await S3Service._getImages(products);
    res.send(productsWithImages);
  });
  getSomePaginatedProducts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { category, page, limit } = req.query;
      const pageNumber = parseInt(page as string) || 1;
      const limitNumber = parseInt(limit as string) || 6;
      
      const query = category ? { category } : {};
      
      const totalCount = await Products.countDocuments(query);
      const startIndex = (pageNumber - 1) * limitNumber;
      const totalPages = Math.ceil(totalCount / limitNumber);
      const paginatedProducts = await Products.find(query).skip(startIndex).limit(limitNumber);
      
      if (!paginatedProducts.length)
        return next(ErrorService.badRequestErr(ResponseMessage.PRODUCT_CATEGORY_INVALID));
      if (!category && Number(page) > totalPages)
        return next(ErrorService.badRequestErr(ResponseMessage.PAGES_ARE_OVER));

      const paginatedProductsWithImages: Product[] = await S3Service._getImages(paginatedProducts);

      if (!paginatedProductsWithImages.length)
        return next(ErrorService.internalErr(ResponseMessage.AWS_BUCKET_ISSUES));
      const response = {
        paginatedProductsWithImages,
        pageNumber,
        totalPages,
        limitNumber,
      };
      res.json(response);
    },
  );
  getOne = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { category, id } = req.query;
    const product: Product[] = await Products.find({ category, _id: id });

    if (!product) return next(ErrorService.badRequestErr(ResponseMessage.PRODUCT_NOT_FOUND));

    const productWithImage: Product[] = await S3Service._getSingleProduct(product);

    if (!productWithImage.length)
      return next(ErrorService.internalErr(ResponseMessage.AWS_BUCKET_ISSUES));
    res.json(productWithImage);
  });
  getManyById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const ids = req.body;
      const products = await Products.find({}).where(DATABASE_ID_PATH).in(ids).exec();
      if (!products.length)
        return next(ErrorService.internalErr(ResponseMessage.PRODUCT_NOT_FOUND));
      const productsWithUrls: Product[] = await S3Service._getImages(products);
      res.json(productsWithUrls);
    },
  );
}

export default new productController();
