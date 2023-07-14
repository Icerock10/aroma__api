import { config } from 'dotenv';
config();
import express from 'express';
import passport from 'passport';
import { googleStrategyConfig } from '../routes/helpers/googleAuthStrategy';
import { UserRoutes } from '../common/enums/user-routes-enums';
import { ProductRoutes } from '../common/enums/product-routes-enums';
import { CommonMessages } from '../common/enums/common-express-enums';
import { MorganModes } from '../common/enums/morgan-middleware-enums';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from '../routes/userRoutes';
import { connectDb } from '../config/db';
import { productsRouter } from '../routes/productsRouter';
import { apiErrorHandler } from '../middlewares/errorHandler';

const app = express();
const port: number = parseInt(process.env.PORT) || 5000;
passport.use(googleStrategyConfig);
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(UserRoutes.USERS, userRouter);
app.use(ProductRoutes.PRODUCTS, productsRouter);
app.use(morgan(MorganModes.DEV));
app.use(apiErrorHandler);

function startApp() {
  app.listen(port, () => {
    connectDb().then(() => {
      console.log(`${CommonMessages.SERVER_STARTED}${port}`);
    });
  });
}

startApp();
