import express from "express"
import { MakeAdmin, getAlluser } from "../controllers/admin.controller";
import verifyRole from "../utils/Varifyrole";
const router = express.Router();

router.get("/alluser",  verifyRole, getAlluser)
router.post("/makeadmin",  verifyRole, MakeAdmin)

export default router