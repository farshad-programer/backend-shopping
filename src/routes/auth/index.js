import { Router } from "express";
const router = Router();
import controller from "./controller.js";
import validateLog from "./validator.js";

router.post(
  "/login",
  validateLog.loginValidator(),
  controller.validate,
  controller.login
);
router.post(
  "/register",
  validateLog.registerValidator(),
  controller.validate,
  controller.register
);
router.get("/refreshToken", controller.handleRefreshToken);
router.get("/logout", controller.logout);
// --------------product-----------------
router.get("/product", controller.getProduct);
router.get("/product/:id", controller.findByIdProduct);
router.get("/findProducts", controller.queryProduct);
// --------------category-----------------
router.get("/category", controller.categoryList);
router.get("/category/:id", controller.findProductsByIdCategory);

export default router;
