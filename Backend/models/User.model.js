import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  googleId: String,
  displayName: String,
  email: String,
  // googleAccessToken: String,
  // googleRefreshToken: String,
});

export const User = mongoose.model("User", userSchema);
export default User;
