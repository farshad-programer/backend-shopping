import { Router } from "express";
 const router = Router();
import controller from "./controller.js";
import imageUpload from "../../middlewares/imageUpload.js";
import validate from "./validator.js"


router.get("/", controller.dashboard);
router.post("/upload",imageUpload, controller.uploadImages);
router.post("/post",validate.postValidator(), controller.createPost);
 export default router