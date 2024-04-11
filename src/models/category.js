import { Schema, model } from "mongoose";
import timestamp from "mongoose-timestamp";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nameEng: {
    type: String,
    required: true,
  },
  nameGrm: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
});
categorySchema.plugin(timestamp);
const Category = model("Category", categorySchema);
export default Category;
