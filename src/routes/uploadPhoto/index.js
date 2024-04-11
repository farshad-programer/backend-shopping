import { Router } from "express";
 const router = Router();
import controller from "./controller.js";
import imageUpload from "../../middlewares/imageUpload.js";




router.post("/", controller.dashboard);
 export default router