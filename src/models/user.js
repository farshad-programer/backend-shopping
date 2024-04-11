import { Schema, model } from "mongoose";
import timestamp from "mongoose-timestamp";


const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  // isadmin: { type: Boolean, default: false},
  refreshToken: [String],
  roles: {
    User: { type: Number, default: 1000 },
    Editor: Number,
    Admin: Number,
  },
});
userSchema.plugin(timestamp);
const User = model("User", userSchema);
export default User;
