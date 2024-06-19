import { Schema, model } from "mongoose";
import timestamp from "mongoose-timestamp";

const productSchema = new Schema({
  name: [
    {
      type: Object,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: "",
  },

  images: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  rating: {
    type: Number,
    default: 0,
    required: true,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    required: true,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});
productSchema.plugin(timestamp);
const Product = model("Product", productSchema);
export default Product;
