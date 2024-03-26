import express from 'express';
import { registerValidation,loginValidation,logoutValidation,searchUserValidation } from '../middleware/validationMiddleware.js';
const router = express.Router()
import {authUser,deleteUser,getUserById,logoutUser,registerUser,getUsers,searchUser} from '../controllers/userControllers.js';
import {protect, admin} from '../middleware/authMiddleware.js';

router.post('/register',registerValidation,registerUser);
router.get('/search',searchUserValidation,searchUser)
router.get('/',protect,admin,getUsers);
router.post('/logout',logoutValidation,protect,logoutUser);
router.post('/login',loginValidation,authUser);
router.route('/:id').delete(protect,admin,deleteUser).get(protect,getUserById);



export default router;

// router.post('/register',registerUser)
// router.get('/:id',protect,getUserById)
// router.delete('/:id',protect,admin,deleteUser)

