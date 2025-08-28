import express from "express";
import passport from "passport";
import { authController } from "../../controllers/AuthController.js";

const router = express.Router();

// api/auth/
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/classroom.courses.readonly",
      "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
    ],
  })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect("/dashboard");
    });
  })(req, res, next);
});


router.get("/logout", authController.logout);

router.get("/current_user", authController.getCurrentUser);

export default router;
