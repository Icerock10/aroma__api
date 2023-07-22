import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { User } from '../../models/User';
import { jwtService } from '../../services/jwt.service';

export const googleStrategyConfig = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
  },
  async (request, _, undefined, profile, done) => {
    const { email, picture, given_name } = profile;
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      const accessToken = jwtService.generateAccessToken(email);
      done(null, accessToken);
    } else {
      await User.create({
        email,
        name: given_name,
        avatarUrl: picture,
      });
      const accessToken = jwtService.generateAccessToken(email);
      done(null, accessToken);
    }
  },
);
