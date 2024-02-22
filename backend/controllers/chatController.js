import Chat from "../model/chatModel.js";
import User from '../model/userModel.js';

//@description create or fetch One to One chat
//@route       POST / api/chat/
//@access      protected

const startChat = async(req,res)=>{
    const {userId}=req.body;
     
    if(!userId){
        console.log("Invalid UserId");
        return res.status(400);
    }

    //retrieve chat
    var existingChat = await Chat.find({
        isGroupChat:false,
            users: {$elemMatch: {$eq: req.user._id,$eq: userId}},
})
    .populate("users", "-password")
    // .populate("latestMessage");

    existingChat = await User.populate(existingChat,{
        path: "users",
        select: "fname lname email",
    });

    if(existingChat.length>0){
        res.send(existingChat[0]);
    }else{
        var chatData = {
            // chatName: req.user.fname,
            users: [req.user._id, userId],
        };
    
    try{
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({_id:createdChat._id}).populate(
            'users',
            '-password'
        );
        res.status(200).json(fullChat);
    }catch(error){
        res.status(400).json(error.message);
    }
 }
}

//@description Fetch all chats for a user
//@route       GET / api/chat/
//@access      protected

const fetchChats = async(req,res)=>{
    try {
        Chat.find({users:{ $elemMatch: { $eq: req.user._id}}})
        .populate("users","-password")
        .populate("users")
        .sort({ updatedAt : -1 })
        .then(async(results)=>{
            results = await User.populate(results,{
                path: "latestMessage.sender",
                select: 'fname lname email',
            });
            res.status(200).send(results);
        })
    } catch (error) {
        res.status(400).json(error.message);
    }
}

export {startChat,fetchChats}
