import controller from "../controller.js";
import _ from "lodash";

export default new (class extends controller {
  async dashboard(req, res) {
    res.send("user dashboard");
  }

  async order(req, res) {
    console.log(process.env.NODE_ENV);

    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new this.OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
      })
    );
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await this.OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new this.Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });
    order = await order.save();

    if (!order) {
      return this.response({
        res,
        code: 400,
        message: "the order cannot be created!",
      });
    }
    return this.response({
      res,
      data: order,
    });
  }
})();
