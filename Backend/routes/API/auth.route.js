import express from "express";
import passport from "passport";
import {authController} from "../../controllers/AuthController.js";

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

router.get(
  "/google/callback",
  passport.authenticate("google"),
  authController.googleCallback
);

router.get("/logout", authController.logout);

router.get("/current_user", authController.getCurrentUser);

export default router;
