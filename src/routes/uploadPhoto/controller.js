import controller from "../controller.js";
import _ from "lodash";
import cloudinary from "cloudinary";
import fs from "fs";
import autoBind from "auto-bind";

export default new (class extends controller {
  async dashboard(req, res) {
    let user = await this.User.findOne({ email: req.body.email }).exec();
    if (user) {
      return this.response({
        res,
        code: 200,
        message: "this user is hear",
      });
    }
    return this.response({
      res,

      message: "this user already hhhhhhh registered",
    });
  }
  async uploadImages(req, res) {
    try {
      
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
  
})();
