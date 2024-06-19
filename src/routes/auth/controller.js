import controller from "../controller.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default new (class extends controller {
  async register(req, res) {
    let user = await this.User.findOne({ email: req.body.email }).exec();
    if (user) {
      return this.response({
        res,
        code: 400,
        message: "this user already registered",
      });
    }
    // const {email, name, password} = req.body;
    // user = new this.User({email, name, password});
    user = new this.User(
      _.pick(req.body, [
        "name",
        "email",
        "password",
        "street",
        "city",
        "zip",
        "country",
        "phon",
        "lName",
      ])
    );

    user.password = await bcrypt.hash(user.password, 15);

    await user.save();

    return this.response({
      res,
      message: "the user successfuly registered",
      data: _.pick(user, [
        "_id",
        "name",
        "email",
        "street",
        "city",
        "zip",
        "country",
        "phon",
        "lName",
      ]),
    });
  }

  // -------------login-----------
  async login(req, res) {
    const cookies = req.cookies;
    const user = await this.User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return this.response({
        res,
        code: 400,
        message: "invalid eamil or  password",
      });
    }
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return this.response({
        res,
        code: 401,
        message: "invalid eamil aa or password",
      });
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: user.email,
          roles: user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    // -----------------------------------------
    let newRefreshTokenArray = !cookies?.jwt
      ? user.refreshToken
      : user.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await this.User.findOne({ refreshToken }).exec();
      if (!foundToken) {
        newRefreshTokenArray = [];
      }

      await res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    user.refreshToken = await [...newRefreshTokenArray, newRefreshToken];
    await user.save();

    return res
      .cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .json({ accessToken, message: "successfuly logged in" });
    // ---------------------------------------------

    // const token = jwt.sign({ _id: user.id }, config.get("jwt_key"));
  }

  async logout(req, res) {
    const { cookies } = req;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    const user = await this.User.findOne({ refreshToken }).exec();
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return this.response({
        res,
        code: 204,
        message: "invalid token",
      });
    }
    const newRefreshTokenArray = user.refreshToken.filter(
      (rt) => rt !== refreshToken
    );
    user.refreshToken = newRefreshTokenArray;
    await user.save();
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return this.response({ res, code: 204, message: "successfuly logged out" });
  }

  // ---------------------------handleRefreshToken-------------

  async handleRefreshToken(req, res) {
    const cookies = req.cookies;

    if (!cookies?.jwt)
      return res.sendStatus(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    const foundUser = await this.User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return;

          const hackedUser = await this.User.findOne({
            email: decoded.email,
          }).exec();

          hackedUser.refreshToken = [];
          await hackedUser.save();
        }
      );
      return res.sendStatus(403).json({ message: "Forbidden" });
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          foundUser.refreshToken = [...newRefreshTokenArray];
          await foundUser.save();
        }

        if (err || foundUser.email !== decoded.email)
          return res.sendStatus(403);

        const accessToken = jwt.sign(
          {
            userInfo: { email: decoded.email, roles: decoded.roles },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
          { email: foundUser.email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await foundUser.save();

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({ accessToken });
      }
    );
  }
  // ---------------getProduct-----------
  async getProduct(req, res) {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }

    const productList = await this.Products.find(filter).populate("category");

    if (!productList) {
      return this.response({
        res,
        data: { success: false },
        code: 500,
        message: error.message,
      });
    }

    return res.json(productList);
  }
  // --------------------findByIdProduct-------------------------

  async findByIdProduct(req, res) {
    try {
      const product = await this.Products.findById(req.params.id).populate(
        "category"
      );

      if (!product) {
        return this.response({
          res,
          data: { success: false },
          code: 500,
          message: error.message,
        });
      }
      return this.response({
        res,
        data: { success: true, product },
        message: `product id : ${req.params.id} is finded `,
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

  // ------------queryProduct------------
  queryProduct = async (req, res) => {
    try {
      const language = req.query.language;
      const queryName = req.query.name;
      let products = {};

      if (!queryName) {
        return this.response({
          res,
          data: { success: false },
          code: 400,
          message: "Query name is required",
        });
      }

      switch (language) {
        case "fa":
          products = await this.Products.find({
            name: { $elemMatch: { lang: "fa", value: { $regex: queryName, $options: "i" } } },
          })
            .limit(10)
            .sort({ "name.value": 1 });
          break;
        case "grm":
          products = await this.Products.find({
            name: { $elemMatch: { lang: "grm", value: { $regex: queryName, $options: "i" } } },
          })
            .limit(10)
            .sort({ "name.value": 1 });
          break;
        default:
          products = await this.Products.find({
            name: { $elemMatch: {lang: "eng", value: { $regex: queryName, $options: "i" } } },
          })
            .limit(10)
            .sort({ "name.value": 1 });
          break;
      }

      if (!products || products.length === 0) {
        return this.response({
          res,
          data: { success: false },
          code: 400,
          message: "There are no products by this query name",
        });
      }

      return res.json({
        data: { success: true, products },
        message: "Ok, received",
      });
    } catch (error) {
      return this.response({
        res,
        data: { success: false },
        code: 500,
        message: error.message,
      });
    }
  };

  //get categoryList-------------------

  async categoryList(req, res) {
    try {
      const categoryList = await this.Category.find();

      if (categoryList.length === 0 || !categoryList)
        return this.response({
          res,
          code: 500,
          data: { success: false },
          message: "there is no category",
        });

      return res.json(categoryList);
    } catch (error) {
      return this.response({
        res,
        data: { success: false },
        code: 500,
        message: error.message,
      });
    }
  }
  // findById categoryList-------------------
  async findProductsByIdCategory(req, res) {
    try {
      const categoryId = req.params.id;
      const products = await this.Products.find({ category: categoryId });

      if (!products) {
        return this.response({
          res,
          code: 400,
          data: { success: false },
          message: "this products not find",
        });
      }
      return this.response({
        res,
        data: { success: true, data: products },
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
})();
