import { Products } from '../models/Products';
import asyncHandler from 'express-async-handler';
import { ErrorService } from '../services/error/error.service';
import S3Service from '../services/aws-s3/s3.service';

interface QueryParams {
  category?: string;
  page?: string;
  limit?: string;
}

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
  upload = asyncHandler(async (req: any, res, next) => {
    if (!req.file || !req.body)
      next(ErrorService.badRequestErr('File was not uploaded, or bad format'));
    const { category, title, subTitle, description, price, productProfile, burnTime, indication } =
      req.body;
    const { originalname, mimetype, buffer } = req.file;

    const isDuplicate = await Products.findOne({ imageName: originalname });
    if (isDuplicate) return next(ErrorService.badRequestErr('This image already exists'));

    await S3Service._upload(originalname, buffer, mimetype);

    const product = await Products.create({
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
  });
  getAll = asyncHandler(async (req, res) => {
    const products = await Products.find({});
    const productsWithImages = await S3Service._getImages(products);
    res.send(productsWithImages);
  });
  getSomePaginatedProducts = asyncHandler(async (req, res, next): Promise<void> => {
    const { category, page, limit }: QueryParams = req.query;
    const products = !category ? await Products.find({}) : await Products.find({ category });
    if (!products.length) next(ErrorService.badRequestErr('Category is invalid'));
    const { paginatedProducts, pageNumber, totalPages, endIndex } = getPaginatedResults(
      page,
      limit,
      products,
    );
    if (!category && Number(page) > totalPages)
      next(ErrorService.badRequestErr('There is no next page'));
    const paginatedProductsWithImages = await S3Service._getImages(paginatedProducts);
    if (!paginatedProductsWithImages.length)
      next(ErrorService.internalErr('Something went wrong with AWS...'));
    const response = {
      paginatedProductsWithImages,
      pageNumber,
      totalPages,
      endIndex,
      limit,
    };
    res.json(response);
  });
  getOne = asyncHandler(async (req, res, next): Promise<void> => {
    const { category, id } = req.query;
    const product = await Products.find({ category, _id: id });

    if (!product) return next(ErrorService.badRequestErr('Product was not found'));

    const productWithImage = await S3Service._getSingleProduct(product);

    if (!productWithImage.length)
      return next(ErrorService.internalErr('Something wrong with AWS service...'));
    res.json(productWithImage);
  });
  getManyById = asyncHandler(async (req, res, next): Promise<void> => {
    const products = await Products.find({}).where('_id').in(req.body).exec();
    if (!products.length) return next(ErrorService.internalErr('Products were not found...'));
    const productsWithUrls = await S3Service._getImages(products);
    res.json(productsWithUrls);
  });
}

export default new Product();
