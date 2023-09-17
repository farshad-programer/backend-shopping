import express from "express";
const router = express.Router();
import controller from "./controller.js";

router.get("/", controller.dashboard);

router.get("/me", controller.me);
export default router;
