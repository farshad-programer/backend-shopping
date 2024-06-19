import { Schema, model } from "mongoose";
import timestamp from "mongoose-timestamp";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  street: {
    type: String,
    required: true,
  },
  phon: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  // isadmin: { type: Boolean, default: false},
  refreshToken: [String],
  roles: {
    type: [String],
    default: ["Employee"],
  },
});
userSchema.plugin(timestamp);
const User = model("User", userSchema);
export default User;
