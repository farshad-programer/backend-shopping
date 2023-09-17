import config from "config";
import jwt from "jsonwebtoken";
import User from "./../models/user.js";

async function isLoggined(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) res.status(401).send("access denied");
  try {
    const decoded = jwt.verify(token, config.get("jwt_key"));
    const user = await User.findById(decoded._id);
    console.log(user);
    req.user = user;
    next();
  } catch (ex) {
    res.status(400).send("invalid token");
  }
}

async function isAdmin(req, res, next) {
  if (!req.user.isadmin) res.status(403).send("access denied");
  next();
}

export { isLoggined, isAdmin };
