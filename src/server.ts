import { config } from 'dotenv';
config();
import express from 'express';
import { UsersPath, ProductsPath } from '../common/enums';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from '../routes/userRoutes';
import { connectDb } from '../config/db';
import { productsRouter } from '../routes/productsRouter';
import { apiErrorHandler } from '../middlewares/errorHandler';

const app = express();
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(UsersPath.ROOT, userRouter);
app.use(ProductsPath.ROOT, productsRouter);
app.use(apiErrorHandler);
const port: string | number = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Hello World');
});

function startApp() {
  app.listen(port, () => {
    connectDb().then(() => {
      console.log(`Express is listening at http://localhost:${port}`);
    });
  });
}

startApp();
