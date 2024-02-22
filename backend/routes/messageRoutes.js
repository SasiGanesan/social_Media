import express from 'express';
import {getallMessages,sendMessage} from '../controllers/messageController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').post(protect,sendMessage);
router.get('/:id',protect,getallMessages)
export default router;



