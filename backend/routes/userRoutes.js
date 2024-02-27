import express from 'express';

const router = express.Router()
import {authUser,deleteUser,getUserById,logoutUser,registerUser,getUsers,searchUser} from '../controllers/userControllers.js';
import {protect, admin} from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(protect,admin,getUsers);
router.post('/logout',logoutUser);
router.post('/login',authUser);
router.route('/:id').delete(protect,admin,deleteUser).get(protect,admin,getUserById);
router.get('/search',searchUser)

export default router;

// router.post('/register',registerUser)
// router.get('/:id',protect,getUserById)
// router.delete('/:id',protect,admin,deleteUser)

