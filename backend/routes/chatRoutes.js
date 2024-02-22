import express from 'express';
import { startChat, fetchChats } from "../controllers/chatController.js";
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect,startChat);
router.route('/').get(protect,fetchChats)
export default router;
