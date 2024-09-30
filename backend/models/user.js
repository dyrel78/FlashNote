import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

// userSchema.pre("save", async function (next) {
//   try {
//     if (this.isModified("password")) {
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};


const User = mongoose.model("users", userSchema);

export default User;
