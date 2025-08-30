import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { acceptFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendRequests, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";

const router = Router()

router.use(verifyJwt);

router.route("/").get(getRecommendedUsers)
router.route("/friends").get(getMyFriends)


router.route("/friend-request/:id").post(sendFriendRequest);
router.route("/accept-request/:id/accept").put(acceptFriendRequest);
router.route("/friend-requests").get(getFriendRequest);


router.route("/outgoing-friend-requests").get(getOutgoingFriendRequests);


export default router;