
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.model.js";
import { config } from "dotenv";
config({
  path: "../config/.env"
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
try {
  const user = await User.findById(id);
  done(null, user);
} catch (error) {

}
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
        }).save();
        done(null, user);
      } catch (error) {
        done(error, null);
        console.error("Error in Google Strategy:", error);
      }
    }
  )
);

