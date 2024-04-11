import { Router } from "express";
const router = Router();
import authRouter from "./auth/index.js";
import userRouter from "./user/index.js";
import adminRouter from "./admin/index.js";
import uploadRouter from "./uploadPhoto/index.js";
import verifyJWT from "./../middlewares/verifyJWT.js";
import ROLES_LIST from "../../config/roles_list.js";
import verifyRoles from "./../middlewares/verifyRoles.js";
router.use("/auth", authRouter);

router.use("/user", userRouter);
router.use("/admin", adminRouter);


export default router;
