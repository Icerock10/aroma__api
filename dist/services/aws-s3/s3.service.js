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
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    region: process.env.BUCKET_REGION,
});
class S3Service {
    constructor() {
        this._s3_instance = s3;
    }
    _upload(originalname, buffer, mimetype) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucketOptions = {
                Bucket: process.env.BUCKET_NAME,
                Key: originalname,
                Body: buffer,
                ContentType: mimetype,
            };
            const command = new client_s3_1.PutObjectCommand(bucketOptions);
            yield this._s3_instance.send(command);
        });
    }
    _getImages(products) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const product of products) {
                const bucketOptions = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: product.imageName,
                };
                const command = new client_s3_1.GetObjectCommand(bucketOptions);
                product.imageUrl = yield (0, s3_request_presigner_1.getSignedUrl)(this._s3_instance, command);
            }
            return products;
        });
    }
    _getSingleProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucketOptions = {
                Bucket: process.env.BUCKET_NAME,
                Key: product[0].imageName,
            };
            const command = new client_s3_1.GetObjectCommand(bucketOptions);
            product[0].imageUrl = yield (0, s3_request_presigner_1.getSignedUrl)(this._s3_instance, command);
            return product;
        });
    }
    _getAvatar(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucketOptions = {
                Bucket: process.env.BUCKET_NAME,
                Key: user.avatar,
            };
            const command = new client_s3_1.GetObjectCommand(bucketOptions);
            user.avatarUrl = yield (0, s3_request_presigner_1.getSignedUrl)(this._s3_instance, command);
            return user;
        });
    }
}
exports.default = new S3Service();
//# sourceMappingURL=s3.service.js.map