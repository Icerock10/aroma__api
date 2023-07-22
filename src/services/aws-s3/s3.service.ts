import { PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Product, IUser } from '../../common/interfaces/interfaces';

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.BUCKET_REGION,
});
class S3Service {
  public _s3_instance: typeof s3;

  constructor() {
    this._s3_instance = s3;
  }

  async _upload(originalname: string, buffer: Buffer, mimetype: string) {
    const bucketOptions = {
      Bucket: process.env.BUCKET_NAME,
      Key: originalname,
      Body: buffer,
      ContentType: mimetype,
    };
    const command = new PutObjectCommand(bucketOptions);
    await this._s3_instance.send(command);
  }

  async _getImages(products: Product[]) {
    for (const product of products) {
      const bucketOptions = {
        Bucket: process.env.BUCKET_NAME,
        Key: product.imageName,
      };
      const command = new GetObjectCommand(bucketOptions);
      product.imageUrl = await getSignedUrl(this._s3_instance, command);
    }
    return products;
  }

  async _getSingleProduct(product: Product[]) {
    const bucketOptions = {
      Bucket: process.env.BUCKET_NAME,
      Key: product[0].imageName,
    };
    const command = new GetObjectCommand(bucketOptions);
    product[0].imageUrl = await getSignedUrl(this._s3_instance, command);
    return product;
  }

  async _getAvatar(user: IUser) {
    const bucketOptions = {
      Bucket: process.env.BUCKET_NAME,
      Key: user.avatar,
    };
    const command = new GetObjectCommand(bucketOptions);
    user.avatarUrl = await getSignedUrl(this._s3_instance, command);
    return user;
  }
}

export default new S3Service();
