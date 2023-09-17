import { Schema, model } from "mongoose";
import timestamp from "mongoose-timestamp";
import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
const { ObjectId } = mongoose.Schema;

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
const productSchema = new Schema({
  price: { type: Number, required: true },
  name: { type: String, required: true },
  images: {
    type: Array,
  },
  description: { type: String, required: true },
  category: { type: String, required: true },
  count: { type: Number },
  comments: [
    {
      comment: {
        type: String,
      },
      image: { type: String },
      commentBy: {
        type: ObjectId,
        reft: "User",
      },
      commentAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});
productSchema.plugin(timestamp);
// ------------order-------------
const orderSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User",
  },
  products: [
    {
      product: {
        type: ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
      orderAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});
orderSchema.plugin(timestamp);
export const Product = model("Product", productSchema);
export const Order = model("Order", orderSchema);

const User = model("User", userSchema);
export default User;
