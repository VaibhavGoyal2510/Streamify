import {Router} from "express"
import { login, logout, onboard, signup } from "../controllers/auth.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { ApiResponse } from "../utils/Apiresponse.js"

const router = Router()



router.route("/login").post(login)
router.route("/logout").post(verifyJwt,logout)
router.route("/signup").post(signup)

router.route("/onboarding").post(verifyJwt,onboard);


// check if user is authenticated or not 
router.route('/me').get(verifyJwt,(req,res)=>{
    res.status(200).json(
        new ApiResponse(200,req.user,"User is Logged in")
    )
})


export default router