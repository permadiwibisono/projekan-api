import express from "express";

import { authMiddleware } from "../../middlewares";
import * as authController from "./auth.controller";

const router = express.Router();

router.post("/login", authController.loginAction);
router.get("/me", authMiddleware, authController.profileAction);
router.post("/logout", authMiddleware, authController.logoutAction);

export default router;
