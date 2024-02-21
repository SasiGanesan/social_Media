import User from '../model/userModel.js';
import generateToken from '../utils/generateToken.js';

//@desc Auth user & get token 
//@route POST /api/users/login
//@access Public

const authUser = async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await User.findOne({email});

        if(user && (await user.matchPassword(password))){
            generateToken(res,user._id);
    
            res.status(200).json({
                _id:user._id,
                fname:user.fname,
                lname:user.lname,
                email:user.email,
                isAdmin:user.isAdmin,
            });
        }else{
            res.status(401).json({message: "Invalid email or password"})
    
        }
    } catch (error) {
        res.status(500).json({message: "server error"})
    }

};

//@desc Register
//@route POST/api/users
//@access Public

const registerUser=async(req,res)=>{
    const {fname,lname,email,gender,DOB,mobileNo,password,confirmPassword,isAdmin}=req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
              message: "Password do not match",
            });
          }
        const userExists=await User.findOne({email});

        if(userExists){
           res.status(400).json({message:"User already exists"})
        }
        const user = await User.create({
           fname,lname,email,gender,DOB,mobileNo,password,confirmPassword,isAdmin
        });

        if(user){
           generateToken(res,user._id);
           res.status(200).json({
               _id:user._id,
               fname: user.fname,
               lname: user.lname,
               email:user.email,
               isAdmin:user.isAdmin,
           })
        }else{
           res.status(400).json({message: "Invalid user data"})
        }
};

//@desc   Logout user/ clear cookie
//@route  POST /api/users/logout
//@access Private

const logoutUser = async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    });
    res.status(200).json({message:'User logged out successfully'})
}

//@desc   Logout user/ clear cookie
//@route  GET /api/users/profile
//@access Public

const getUserById=async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        // console.log(user)
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({message: "User not found"});
        } 
    } catch (error) {
        // console.log(error.message)
        res.status(400).json({
            message: "Invalid user Id"
        })
    }
    
}

//@desc   Delete users 
//@route  DELETE /api/users/:id
//@access Private/admin

const deleteUser = async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        console.log(user)
        if(user){
            if(user.isAdmin){
                res.status(400).json({message:'Cannot delete admin user'});    
             }
       
        await User.deleteOne({_id:user._id})
        res.status(200).json({message: 'User deleted successfully'})
     }else{
        res.status(404).json("User not found");
    } 
    } catch (error) {
        // console.log(error.message)
        res.status(500).json({message: "Internal server error"})
    }
 
};

//@desc   Get users 
//@route  GET /api/users
//@access Private/admin
const getUsers = async(req,res)=>{
    try {
        const user_id =req.user_id
        const users = await User.find({user_id});
        // console.log(users)
        // console.log(users)
        if(users.length===0){
            return res.status(404).json({message: "User not found"})
        }else{
            return res.status(200).json(users);
        }
    } catch (error) {
        // console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    
    }
};

const searchUser=async(req,res)=>{
    const userId = req.query.id;
    const {fname} = req.query;
    try {
        const users = userId ? {_id: userId} : {fname: {$regex: new RegExp(fname, 'i')}};
        const user = await User.findOne(users);
        const response = user ? { fname: user.fname, lname: user.lname  } : 'User not found';
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: 'Internal Server Error' })
    }
}


export {authUser,deleteUser,getUserById,logoutUser,registerUser,getUsers,searchUser}