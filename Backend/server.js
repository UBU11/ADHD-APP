import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/Db.js";
import "./config/passport.js";
import assignmentRoutes from "./routes/API/assignment.route.js";
import authRoutes from "./routes/API/auth.route.js";


connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({

    secret:"process.env.SESSION_SECRET",

    resave: false,
    saveUninitialized: false,


    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
    },
  })
);

// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//     keys: [process.env.COOKIE_KEY],
//   })
// );

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
