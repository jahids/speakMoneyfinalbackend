import express from "express";
import { login, logout, signUp } from "../controllers/users";
import { FeedBackMessage } from "../controllers/speak.user.controller";
const router = express.Router();

router.post("/mailsend", FeedBackMessage);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
