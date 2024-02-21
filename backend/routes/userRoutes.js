import express from 'express';

const router = express.Router()
import {authUser,deleteUser,getUserById,logoutUser,registerUser,getUsers,searchUser} from '../controllers/userControllers.js';
import {protect, admin} from '../middleware/authMiddleware.js';

router.post('/register',registerUser)
router.post('/logout',logoutUser);
router.post('/login',authUser);
router.get('/',protect,admin,getUsers)
router.get('/search',searchUser)
router.get('/:id',protect,admin,getUserById)
router.delete('/:id',protect,admin,deleteUser)
export default router;

