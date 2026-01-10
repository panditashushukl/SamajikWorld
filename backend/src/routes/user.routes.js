import {
  changeCurrentPassword,
  getCurrentUser,
  getUserCurrentProfile,
  getWatchHistory,
  loggedOutUser,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  addToWatchHistory,
  getWatchLaterVideos,
  addToWatchLater,
  clearAllWatchHistory,
  removeFromWatchLater,
  removeFromWatchHistory,
  getSettings,
  updateSettings,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import { Router } from "express";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured Route
router.route("/logout").post(verifyJWT, loggedOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-details").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserCurrentProfile);

router.route("/watch-history").get(verifyJWT, getWatchHistory);
router
  .route("/add-to-watch-history/:videoId")
  .post(verifyJWT, addToWatchHistory);
router.route("/get-watch-later").get(verifyJWT, getWatchLaterVideos);
router.route("/add-to-watch-later/:videoId").post(verifyJWT, addToWatchLater);

router
  .route("/clear-all-watch-history")
  .delete(verifyJWT, clearAllWatchHistory);
router
  .route("/remove-from-watch-later/:videoId")
  .delete(verifyJWT, removeFromWatchLater);

router
  .route("/remove-from-watch-history/:videoId")
  .delete(verifyJWT, removeFromWatchHistory);

router.route("/settings").get(verifyJWT, getSettings);
router.route("/settings").patch(verifyJWT, updateSettings);

export default router;
