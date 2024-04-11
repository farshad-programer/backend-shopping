import { Router } from "express";
const router = Router();
import controller from "./controller.js";
import Order from "../../models/order.js";


router.post("/category", controller.postCategoryList);
router.put("/category/:id", controller.updateCategoryList);
router.delete("/category/:id", controller.deleteCategoryList);
// -----------product-----------------
router.post("/product", controller.postProduct);
router.get("/product", controller.countProduct);
router.get(`/product/featured/:count`, controller.sendFeaturedProduct);
router.delete("/product/:id", controller.deletProduct);
router.put("/product/:id", controller.updateProduct);
// -----------user-----------------
router.get("/user", controller.userGet);
router.delete("/user/:id", controller.deleteUser);
router.put("/user/:id", controller.userUpdate);
router.get("/user/:id", controller.findByIdUser);
// -----------image-------------------
router.post("/upload", controller.uploadImage);
router.put("/upload/:id", controller.updateImage);
// -------------Order---------------
router.get("/order", controller.getOrder);
router.get("/order/:id", controller.orderFindById);
router.put("/order/:id", controller.orderUpdate);
router.delete("/order/:id", controller.orderRemove);
router.get("/orders/totalsales", controller.getOrderTotalPrice);

export default router;
