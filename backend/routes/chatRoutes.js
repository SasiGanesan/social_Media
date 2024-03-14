import express from 'express';
import { startChat, fetchChats } from "../controllers/chatController.js";
import {protect} from '../middleware/authMiddleware.js';
import {OneToOneChatValidation} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/',OneToOneChatValidation,protect,startChat);
router.get('/',protect,fetchChats)
export default router;
