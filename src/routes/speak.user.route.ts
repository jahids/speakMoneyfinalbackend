import express from "express";
import { logout } from "../controllers/users";
import { loginsm, signUpsm } from "../controllers/speak.user.controller";
const router = express.Router();

router.post("/speak/signup", signUpsm);
router.post("/speak/login", loginsm);
router.post("/speak/logout", logout);

export default router;
