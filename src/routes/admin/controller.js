import controller from "./../controller.js";
import _ from "lodash";
import multer from "multer";
import upload from "../../middlewares/upload.js";
import mongoose from "mongoose";
import Product from "../../models/product.js";
import fs from "fs";
import bcrypt from "bcrypt";

export default new (class extends controller {
  // -----------updateuser----------------
  async userUpdate(req, res) {
    let user = await this.User.findById(req.params.id).exec();
    if (!user) {
      return this.response({
        res,
        data: { success: false },
        code: 400,
        message: "there is no user!",
      });
    }
    // const {email, name, password} = req.body;
    // user = new this.User({email, name, password});
    user = new this.User(_.pick(req.body, ["name", "email", "password"]));
    user.password = await bcrypt.hash(user.password, 15);
    const newUser = await this.Category.findByIdAndUpdate(req.params.id, user, {
      new: true,
    }).exec();
    if (!newUser) {
      return this.response({
        res,
        data: { success: false },
        code: 400,
        message: "the user cannot be update!",
      });
    }
    return this.response({
      res,
      message: "the user successfuly updated",
      data: { success: true, newUser },
    });
  }
  // --------------getuser------------
  async userGet(req, res) {
    try {
      const users = await this.User.find();

      if (users.length === 0 || !users)
        return this.response({
          res,
          code: 500,
          data: { success: false },
          message: "there is no user",
        });

      return this.response({
        res,
        data: { success: true, users },
      });
    } catch (error) {
      return this.response({
        res,
        data: { success: false },
        code: 500,
        message: error.message,
      });
    }
  }
  // ----------removeUser-----------
  async deleteUser(req, res) {
    try {
      const user = await this.User.findByIdAndRemove(req.params.id);
      if (!user) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: "this user not find",
        });
      }

      return this.response({
        res,
        data: { success: true },
        message: "the user is deleted!",
      });
    } catch (error) {
      return this.response({
        res,
        data: { success: false },
        code: 500,
        message: error.message,
      });
    }
  }
  // ------------findByIdUser-----------
  async findByIdUser(req, res) {
    try {
      const user = await this.User.findById(req.params.id);
      if (!user) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: "this user not find",
        });
      }
      return this.response({
        res,
        data: { success: true, user },
      });
    } catch (error) {
      return this.response({
        res,
        code: 500,
        data: { success: false },
        message: error.message,
      });
    }
  }
  // postCategory------------------
  async postCategoryList(req, res) {
    try {
      const { language, name, icon, color } = req.body;
      let category = {};
      
      switch (language) {
        case "eng":
          category = await this.Category.findOne({
            name: { $elemMatch: { lang: "grm ", value: name } }
          }).exec();
          break;
        case "fa":
          category = await this.Category.findOne({
            name: { $elemMatch: { lang: "fa", value: name } }
          }).exec();
          break;
        default:
          category = await this.Category.findOne({
            name: { $elemMatch: { lang: "eng", value: name } }
          }).exec();
          break;
      }
  
      if (category) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: "This category is already registered"
        });
      }
  
      category = new this.Category({
        name:req.body.name,
        icon,
        color
      });
  
      if (category.name.length === 0) {
        return this.response({
          res,
          data: { success: false },
          code: 400,
          message: "The category was not created"
        });
      }
  
      category = await category.save();
  
      return this.response({
        res,
        data: { success: true, category }
      });
    } catch (error) {
      return this.response({
        res,
        data: { success: false },
        code: 500,
        message: error.message
      });
    }
  }
  
  // putCategory---------------------
  async updateCategoryList(req, res) {
    try {
      const { name, icon, color } = req.body;
      let category = {};
  
      const language=req.params.lang
      switch (language) {
        case "eng":
          category = await this.Category.findOne({
            name: { $elemMatch: { lang: "eng", value: nameEng } }
          }).exec();
          break;
        case "fa":
          category = await this.Category.findOne({
            name: { $elemMatch: { lang: "fa", value: name } }
          }).exec();
          break;
        default:
          category = await this.Category.findOne({
            name: { $elemMatch: { lang: "grm", value: nameGrm } }
          }).exec();
          break;
      }
  
      if (category) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: "This category is already registered"
        });
      }
  
     
      category = await this.Category.findById(req.params.id).exec();
  
      if (!category) {
        return this.response({
          res,
          data: { success: false },
          code: 400,
          message: "The category cannot be found!"
        });
      }
  
     
      category.name = category.name.map(item => {
        if (item.lang === "eng") {
          item.value = nameEng || item.value;
        } else if (item.lang === "fa") {
          item.value = name || item.value;
        } else if (item.lang === "grm") {
          item.value = nameGrm || item.value;
        }
        return item;
      });
  
      
      category.icon = icon || category.icon;
      category.color = color || category.color;
  
      
      category = await category.save();
  
      return this.response({
        res,
        data: { success: true, category }
      });
    } catch (error) {
      return this.response({
        res,
        data: { success: false },
        code: 500,
        message: error.message
      });
    }
  }
  
  // deleteCategory---------------------
  async deleteCategoryList(req, res) {
    try {
      const category = await this.Category.findByIdAndRemove(req.params.id);
      if (!category) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: "this category not find",
        });
      }

      return this.response({
        res,
        data: { success: true },
        message: "the category is deleted!",
      });
    } catch (error) {
      return this.response({
        res,
        data: { success: false },
        code: 500,
        message: error.message,
      });
    }
  }
  //  finish_Category----------------------------
  // post product--------------------------
  async postProduct(req, res) {
    try {
      const category = await this.Category.findById(req.body.category);
      if (!category) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: "this category not find",
        });
      }
      let product = await new this.Products({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      });
      product = await product.save();

      try {
        const newProduct = await this.Products.findById(product._id).populate(
          "category"
        );

        return this.response({
          res,
          data: { success: true, product: newProduct },
          message: "The product is created created",
        });
      } catch (error) {
        return this.response({
          res,
          code: 500,
          data: { success: false },
          message: "The product created but do not finded",
        });
      }
    } catch (error) {
      return this.response({
        res,
        code: 500,
        data: { success: false },
        message: error.message,
      });
    }
  }
  // -------------updateProduct--------------------
  async updateProduct(req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: "Invalid Product Id",
        });
      }

      let category = await this.Category.findById(req.body.category);

      if (!category || category.length === 0) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: "this category not find",
        });
      }

      const product = await this.Products.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description,
          richDescription: req.body.richDescription,
          image: req.body.image,
          brand: req.body.brand,
          price: req.body.price,
          category: req.body.category,
          countInStock: req.body.countInStock,
          rating: req.body.rating,
          numReviews: req.body.numReviews,
          isFeatured: req.body.isFeatured,
        },
        { new: true }
      );

      if (!product)
        return this.response({
          res,
          data: { success: false },
          code: 400,
          message: "the product cannot be updated!",
        });
      return this.response({
        res,
        data: { success: true, product },
        message: "the product has updated!",
      });
    } catch (error) {
      return this.response({
        res,
        data: { success: false, error: err },
        code: 500,
      });
    }
  }
  async deletProduct(req, res) {
    try {
      let product = await this.Products.findById(req.params.id);

      if (!product) {
        return this.response({
          res,
          data: { success: false },
          message: "the product not finde!",
          code: 400,
        });
      }

      const images = product.images;
      for (const image of images) {
        const modifiedUrl = image.replace(`${process.env.ADLOCAL}`, "");
        this.#removeTemp(modifiedUrl);
      }
      product = await this.Products.findByIdAndRemove(req.params.id);

      if (!product) {
        return this.response({
          res,
          data: { success: false },
          code: 404,
          message: "product not found!",
        });
      }
      return this.response({
        res,
        data: { success: true },
        message: "the product is deleted!",
      });
    } catch (error) {
      return this.response({
        res,
        code: 500,
        data: { success: false },
        message: error.message,
      });
    }
  }
  async countProduct(req, res) {
    try {
      let productCount = await this.Products.countDocuments({}).exec();

      if (!productCount) {
        return this.response({
          res,
          data: { success: false },
          code: 400,
        });
      }
      return this.response({
        res,
        data: { success: true, productCount },
      });
    } catch (error) {
      return this.response({
        res,
        code: 500,
        data: { success: false },
        message: error.message,
      });
    }
  }
  async sendFeaturedProduct(req, res) {
    try {
      const count = req.params.count ? req.params.count : 0;
      const products = await this.Products.find({ isFeatured: true }).limit(
        +count
      );

      if (!products) {
        return this.response({
          res,
          data: { success: false },
          message: "there is no product",
          code: 500,
        });
      }
      return this.response({
        res,
        data: { products, success: true },
      });
    } catch (error) {
      return this.response({
        res,
        code: 500,
        data: { success: false },
        message: error.message,
      });
    }
  }
  // -------------------uploadImage------------------------
  async uploadImage(req, res) {
    try {
      upload.array("images", 10)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ message: err.message });
        } else if (("gta:", err)) {
          return res.status(500).json({ message: err.message });
        } else {
          if (req.files.length === 0) {
            return res.status(502).json({ message: "there is no file" });
          } else {
            const files = req.files;
            console.log(files);
            const imagesPaths = [];
            const basePath = `${req.protocol}://${req.get("host")}/`;

            if (files) {
              files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
              });
            }

            return res.status(200).json({ images: imagesPaths });
          }
        }
      });
    } catch (error) {
      return this.response({
        res,
        code: 500,
        message: error.message,
      });
    }
  }
  // -------------------updateImage------------------------
  async updateImage(req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res
          .status(400)
          .json({ data: { message: "Invalid Product Id", success: false } });
      }
      upload.array("images", 10)(
        req,
        res,
        async function (err) {
          if (err instanceof multer.MulterError) {
            return res.status(500).json({ data: { message: err.message } });
          } else if (("gta:", err)) {
            return res.status(500).json({ data: { message: err.message } });
          } else {
            if (req.files.length === 0) {
              return res
                .status(502)
                .json({ data: { message: "there is no file" } });
            } else {
              const files = req.files;
              const imagesPaths = [];
              const basePath = `${req.protocol}://${req.get("host")}/`;

              if (files) {
                files.map((file) => {
                  imagesPaths.push(`${basePath}${file.filename}`);
                });
              }
              let product = await Product.findById(req.params.id);
              if (!product) {
                return res.status(500).json({
                  data: {
                    message: "there is no product",
                    success: false,
                  },
                });
              }
              const images = product.images;
              for (const image of images) {
                const modifiedUrl = image.replace(`${process.env.ADLOCAL}`, "");
                this.#removeTemp(modifiedUrl);
              }
              product = await Product.findByIdAndUpdate(
                req.params.id,
                {
                  images: imagesPaths,
                },
                { new: true }
              );
              return res.status(200).json({ data: { images: imagesPaths } });
            }
          }
        }.bind(this)
      );
    } catch (error) {
      return this.response({
        res,
        code: 500,
        message: error.message,
      });
    }
  }
  async #removeTemp(pat) {
    let fullPath = `./public/uploads/${pat}`;

    fs.unlink(fullPath, (err) => {
      if (err);
    });
  }

  // -------------------Order-------------
  async getOrder(req, res) {
    try {
      const orderList = await this.Order.find()
        .populate("user", "name")
        .populate("orderItems")
        .sort({ createdAt: -1 });
      if (!orderList || orderList.length === 0) {
        return this.response({
          res,
          data: { success: false },
          code: 400,
          message: "there is no order",
        });
      }
      return this.response({
        res,
        data: { success: true, data: orderList },
      });
    } catch (error) {
      return this.response({
        res,
        code: 500,
        data: { success: false },
        message: error.message,
      });
    }
  }
  async orderFindById(req, res) {
    try {
      const order = await this.Order.findById(req.params.id)
        .populate("user", "name")
        .populate({
          path: "orderItems",
          populate: {
            path: "product",
            populate: "category",
          },
        });
      if (!order || order.length === 0) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: `there is no order by this id ${req.params.id}`,
        });
      }
      return this.response({
        res,
        data: { data: order, success: true },
      });
    } catch (error) {
      return this.response({
        res,
        code: 400,
        data: { success: false },
        message: error.message,
      });
    }
  }
  async orderUpdate(req, res) {
    try {
      const order = await this.Order.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        { new: true }
      );
      if (!order || order.length === 0) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: `the order cannot be update! ${req.params.id}`,
        });
      }
      return this.response({
        res,
        data: { data: order, success: true },
      });
    } catch (error) {
      return this.response({
        res,
        code: 500,
        data: { success: false },
        message: error.message,
      });
    }
  }
  // ----------------orderRemove------------------
  async orderRemove(req, res) {
    this.Order.findByIdAndRemove(req.params.id)
      .then(async (order) => {
        if (order) {
          await order.orderItems.map(async (orderItem) => {
            await this.OrderItem.findByIdAndRemove(orderItem);
          });
          return this.response({
            res,
            data: { success: true },
            message: "the order is deleted!",
          });
        } else {
          return this.response({
            res,
            code: 404,
            data: { success: false },
            message: "order not found!",
          });
        }
      })
      .catch((error) => {
        return this.response({
          res,
          code: 500,
          data: { success: false },
          message: error.message,
        });
      });
  }
  // ----------------getOrderTotalPrice---------------
  async getOrderTotalPrice(req, res) {
    try {
      let totalSales = await this.Order.aggregate([
        {
          $match: {
            $updatedAt: 11,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$updatedAt" },
              month: { $month: "$updatedAt" },
            },
            totalsales: { $sum: "$totalPrice" },
          },
        },
      ]);

      if (!totalSales) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: "The order sales cannot be generated",
        });
      }
      return this.response({
        res,
        data: { success: true, totalSales },
        message: "totalSales is recived",
      });
    } catch (error) {
      return this.response({
        res,
        code: 500,
        data: { success: false },
        message: error.message,
      });
    }
  }
  // ----------------getOrderCount---------------

  async getOrderCount(req, res) {
    try {
    } catch (error) {
      return this.response({
        res,
        code: 500,
        data: { success: false },
        message: error.message,
      });
    }
  }
  // ----------------getOrderUser---------------

  async getOrderUser(req, res) {
    try {
    } catch (error) {
      return this.response({
        res,
        code: 500,
        data: { success: false },
        message: error.message,
      });
    }
  }
})();
