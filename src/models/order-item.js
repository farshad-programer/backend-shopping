import { Schema, model } from "mongoose";
import timestamp from "mongoose-timestamp";

const orderItemSchema =new Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    }
})
orderItemSchema.plugin(timestamp);
const OrderItem = model("OrderItem", orderItemSchema);
export default OrderItem;



