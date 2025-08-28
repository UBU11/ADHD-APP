import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";
import passport from "passport";
import connectDB from "./config/Db.js";
import "./config/passport.js";
import assignmentRoutes from "./routes/API/assignment.route.js";
import authRoutes from "./routes/API/auth.route.js";
import session from "express-session";

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: "catisbest",
    resave: false,
    saveUninitialized: true,
  })
);

// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//     keys: ["process.env.COOKIE_KEY"],
//   })
// );

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);

app.get("/dashboard", (req, res) => {
  res.send(`Welcome ${req.user.displayName}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
