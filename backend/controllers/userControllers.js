import User from '../model/userModel.js';
import generateToken from '../utils/generateToken.js';

//@desc Auth user & get token 
//@route POST /api/users/login
//@access Public
const authUser = async (req,res) => {
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
        res.status(500).json({message: "Internal Server error"})
    }

};

//@desc Register
//@route POST/api/users
//@access Public
const registerUser=async(req,res)=>{
    const {fname,lname,email,gender,DOB,mobileNo,password,confirmPassword,isAdmin}=req.body;
   
try {
    if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Password do not match",
        });
      }
    const userExists=await User.findOne({email});

    if(userExists){
       res.status(400).json({message:"User already exists"})
    }

    //Create a new user 
    const user = await User.create({
        fname,lname,email,gender,DOB,mobileNo,password,confirmPassword,isAdmin});
    if(user){
       generateToken(res,user._id);
       res.status(200).json({
           _id:user._id,
           fname: user.fname,
           lname: user.lname,
           email:user.email,
           isAdmin:user.isAdmin,
       });
    }else{
         return res.status(400).json({message: "Invalid user data"})
    }
} catch (error) {
         return res.status(500).json({message: "Internal server error"})
}    
}

//@desc   Logout user/ clear cookie
//@route  POST /api/users/logout
//@access Private
const logoutUser = async(req,res)=>{
   // Clear the JWT (JSON Web Token) cookie
    res.cookie('jwt','',{
        httpOnly:true, // Make the cookie accessible only through HTTP(S) requests, not client-side JavaScript
        expires:new Date(0) // Set the expiration date to the past, effectively deleting the cookie
    });

      // Respond with a JSON message indicating successful user logout
    res.status(200).json({message:'User logged out successfully'})
}
// it clears the JWT cookie associated with the user by setting it to an empty string and making it expire immediately


//@desc   Logout user/ clear cookie
//@route  GET /api/users/profile
//@access Public
const getUserById=async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(user){
            return res.status(200).json(user);
        }else{
            return res.status(404).json({message: "User not found"});
        } 
    } catch (error) {
            return res.status(400).json({message: "Invalid user Id"})
    }
    
}

//@desc   Delete users 
//@route  DELETE /api/users/:id
//@access Private/admin
const deleteUser = async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(user){
            if(user.isAdmin){
                res.status(400).json({message:'Cannot delete admin user'});    
             }
       
        await User.deleteOne({_id:user._id})
        return res.status(200).json({message: 'User deleted successfully'})
     }else{
        return res.status(404).json("User not found");
    } 
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
};

//@desc   Get users 
//@route  GET /api/users
//@access Private/admin
const getUsers = async(req,res)=>{
    try {
        const user_id =req.user_id
        const users = await User.find({user_id});
        if(users.length===0){
            return res.status(404).json({message: "User not found"})
        }else{
            return res.status(200).json(users);
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    
    }
};


//Search User using their fname, parse the string using regular expression (RegExp)
    const searchUser = async (req, res) => {
        const { fname } = req.query;
        try {
            if (!fname) {
                return res.status(400).json({ error: 'Please provide fname for searching.' });
            }
            //RegExp regular expression it is used for parse the string
            const users = await User.find({ fname: { $regex: new RegExp(fname, 'i') } });
    
            if (users.length > 0) {
                const response = users.map(user => ({ fname: user.fname, lname: user.lname }));
                return res.status(200).json(response);
            } else {
                return res.status(404).json({ message: 'No users found with the provided fname.' });
            }
        } catch (error) {
           return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    


export {authUser,deleteUser,getUserById,logoutUser,registerUser,getUsers,searchUser}
