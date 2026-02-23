import { Router } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

const router = Router();

router.get("/health", (req, res) => {
  res.status(HTTP_STATUS.OK).json({ status: "ok" });
});

export default router;