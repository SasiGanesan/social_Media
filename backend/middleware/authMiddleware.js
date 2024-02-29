import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

//Protect routes
const protect = async(req, res, next)=>{
    let token;

    //Read the JWT from the cookie
    token=req.cookies.jwt;

    if(token){
        try{
            // Verify the JWT using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // Fetch user details from the database based on the decoded user ID
            req.user = await User.findById(decoded.userId).select('-password')
            next();
        }catch(error){
            // Handle token verification failure
            // console.log(error)
            res.status(401).json('Not authorized, token failed');
        }   
     }else{
        res.status(401).json('Not authorized, no token');
    }
};

//Admin middleware
const admin = (req, res, next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401).json('Not authorized as admin')
    }
};


export { protect, admin};