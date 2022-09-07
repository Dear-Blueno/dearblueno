import passport from "passport";
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import User, { IUser } from "../models/User";

export default function passportConfig() {
  // Convert the user database model to an id for passport
  passport.serializeUser((user, done) => {
    done(null, (user as IUser)._id);
  });

  // Convert the id back to a user database model
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID ?? ".",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ".",
        callbackURL: process.env.GOOGLE_CALLBACK_URL ?? ".",
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        // Extract user information from the profile
        const { sub, name, email, picture, given_name, family_name } =
          profile._json;

        // Verify user if from brown.edu domain
        const verifiedBrown =
          profile._json.hd === "brown.edu" ||
          profile._json.hd === "alumni.brown.edu";

        if (!verifiedBrown) {
          return done("Not a verified Brown user");
        }

        try {
          // Find user by google id, or upsert if not found
          const existingUser = await User.findOneAndUpdate(
            { googleId: sub },
            {
              name,
              givenName: given_name,
              familyName: family_name,
              email,
              profilePicture: picture,
              lastLoggedIn: new Date(),
              verifiedBrown,
            },
            { new: true, upsert: true }
          );
          return done(null, existingUser);
        } catch (err) {
          done(String(err));
        }
      }
    )
  );
}
