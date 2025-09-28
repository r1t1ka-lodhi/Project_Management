import { Router } from "express";
import { healthCheckController } from "../controllers/healthcheck.controllers.js";

const router = Router();
router.route("/").get(healthCheckController);

export default router;