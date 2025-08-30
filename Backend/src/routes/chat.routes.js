import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = Router()


router.route("/token").get(verifyJwt,getStreamToken);


export default router;