import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import storiesRouter from "./stories";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(storiesRouter);
router.use(adminRouter);

export default router;
