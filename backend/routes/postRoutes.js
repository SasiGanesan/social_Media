import express from 'express';
import {postImageValidation} from '../middleware/validationMiddleware.js'
import { createPost } from "../controllers/postController.js";
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router()

router.post('/upload',postImageValidation,createPost)


export default router;
