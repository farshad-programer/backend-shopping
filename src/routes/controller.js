import autoBind from "auto-bind";
import { validationResult } from "express-validator";
import User from "./../models/user.js";
import { Product ,Order} from "./../models/user.js";
import cloudinary from "cloudinary";

export default class {
  constructor() {
    autoBind(this);
    this.User = User;
    this.Product = Product;
    this.Oreder=Order
    cloudinary.config({
      cloud_name: "dt9owuw6r",
      api_key: "897585674715222",
      api_secret: "9sDpkAlVdx3jw1zpsTzMiNuMiGg",
    });
  }

  validationBody(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array();
      const messages = [];
      errors.forEach((err) => messages.push(err.msg));
      res.status(400).json({
        message: "validation error",
        data: messages,
      });
      return false;
    }
    return true;
  }

  validate(req, res, next) {
    if (!this.validationBody(req, res)) {
      return;
    }
    next();
  }

  response({ res, message, code = 200, data = {} }) {
    res.status(code).json({
      message,
      data,
    });
  }
}
