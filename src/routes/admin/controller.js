import controller from "./../controller.js";
import _ from "lodash";
import cloudinary from "cloudinary";
import fs from "fs";
import autoBind from "auto-bind";

export default new (class extends controller {
  async dashboard(req, res) {
    return this.response({
      res,

      message: "this user already hhhhhhh registered",
    });
  }
  async uploadImages(req, res) {
    try {
      
      console.log(this.#uploadToCloudinary);
      const { path } = "home";
      if (!path) return res.status(400).json({ message: "path is empty" });
      let files = Object.values(req.files).flat();
      let images = [];
      for (const file of files) {
        const url = await this.#uploadToCloudinary(file, path);
        images.push(url);
        this.#removeTemp(file.tempFilePath);
      }
      res.json({ images });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  async #uploadToCloudinary(file, path) {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        {
          folder: path,
        },
        (err, res) => {
          if (err) {
            this.#removeTemp(file.tempFilePath);
            return reject(err);
          }

          resolve({
            url: res.secure_url,
          });
        }
      );
    });
  }
  async #removeTemp(path) {
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
  }

  // ---------------------postControlle
  async createPost(req, res) {
    try {
      let product = await this.Product.findOne({ name: req.body.name }).exec();
      if (product) {
        return this.response({
          res,
          code: 400,
          message: "this product already registered",
        });
      }
      //  const user = await UserModel.findById(req.userId);

       product = req.body;
      if (
        !product.count &&
        !product.images &&
        !product.category &&
        !product.price &&
        !product.name &&
        !product.description
      ) {
        return res.status(400).json({
          message: "please make compelet the form",
        });
      }
       product = new this.Product(
        _.pick(req.body, [
          "name",
          "count",
          "images",
          "category",
          "price",
          "description",
          "userId",
        ])
      );
      await product.save();

      this.response({
        res,
        message: "the product successfuly registered",
        data: _.pick(product, [
          "name",
          "count",
          "images",
          "category",
          "price",
          "description",
          "userId",
        ]),
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
})();
