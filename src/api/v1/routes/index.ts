import { Router } from "express";
import eventRoutes from "./eventRoutes";
import healthRoutes from "./healthRoutes";

const router = Router();

router.use(healthRoutes);
router.use(eventRoutes);

export default router;