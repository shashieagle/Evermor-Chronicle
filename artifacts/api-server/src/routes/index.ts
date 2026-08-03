import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import storiesRouter from "./stories";
import journalRouter from "./journal";
import adminRouter from "./admin";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(storiesRouter);
router.use(journalRouter);
router.use(adminRouter);
router.use(contactRouter);

export default router;
