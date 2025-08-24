const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../../controllers/authController");

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

module.exports = router;
