import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import User from "../models/User";

const userRouter = Router();

// GET request that gets a user by id
userRouter.get("/:id", param("id").isInt({ min: 1 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.params) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const user = await User.findOne({ googleId: req.params.id });
  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.json({
    user: {
      googleId: user.googleId,
      name: user.name,
      profilePicture: user.profilePicture,
      level: user.level,
      streakDays: user.streakDays,
      verifiedBrown: user.verifiedBrown,
    },
  });
});

// PUT request that updates a user's bio profile
userRouter.put(
  "/bio",
  body("bio").optional().isString(),
  body("instagram")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["instagram.com"],
    }),
  body("twitter")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["twitter.com"],
    }),
  body("facebook")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["facebook.com"],
    }),
  body("concentration").optional().isString(),
  body("classYear").optional().isInt({ min: 1900, max: 2100 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // const user = req.user as IUser;
  }
);

// TODO: Add routes here

export default userRouter;
