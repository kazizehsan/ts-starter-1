import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import tokenTypes from '../token/token.types.js';
import config from '../../config/config.js';
import User from '../user/user.model.js';
import { IPayload } from '../token/token.interfaces.js';

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: IPayload, done) => {
    try {
      if (payload.type !== tokenTypes.ACCESS) {
        throw new Error('Invalid token type');
      }
      const user = await User.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

export default jwtStrategy;
