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
export default router;
