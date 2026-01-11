import { Router } from 'express';
import { getFeed } from "../controllers/feed.controller.js";

const router = Router();

router.route("/").get(getFeed);

export default router;
