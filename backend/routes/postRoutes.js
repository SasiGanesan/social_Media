import express from 'express';
import { createPost } from "../controllers/postController.js";
import {protect} from '../middleware/authMiddleware.js';
const router = express.Router()

router.post('/upload',createPost)


export default router;
