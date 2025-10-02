
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModels.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure this module can load env independently of server startup order
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverEnvPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: serverEnvPath });


passport.use(

  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {

  // Google strategy registered

        // check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // if not, create a new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
        }

        // pass user to passport
        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
  
);



export default passport;
