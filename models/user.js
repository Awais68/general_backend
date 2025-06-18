import mongoose from "mongoose";

const { Schema } = mongoose;
const UserSchema = Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", UserSchema);

export default User;

// address: { type: String },
// DOB: { type: String },
// city: { type: String, trim: true },
// country: { type: String, trim: true },
