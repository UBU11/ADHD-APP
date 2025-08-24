import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  displayName: String,
  email: String,
  // googleAccessToken: String,
  // googleRefreshToken: String,
});

export default User = mongoose.model("User", userSchema);
