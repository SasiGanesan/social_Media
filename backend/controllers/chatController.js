import Chat from "../model/chatModel.js";
import User from '../model/userModel.js';

//@description create or fetch One to One chat
//@route       POST / api/chat/
//@access      protected

const accessChat = async(req,res)=>{
    const {userId}=req.body;
     
    if(!userId){
        console.log("UserId param not sent with request");
        return res.status(400);
    }

    //retrieve chat
    var isChat = await Chat.find({
        $and:[
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat,{
        path: "latestMessage.sender",
        select: "fname lname email",
    });

    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName: 'sender',
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
        .populate("latestMessage")
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

export {accessChat,fetchChats}
