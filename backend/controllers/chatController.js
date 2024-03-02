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

    //retrieve chat if it exists for the given users
    var existingChat = await Chat.find({
        isGroupChat:false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
          ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

    // existingChat = await User.populate(existingChat,{
    //     path: "latestMessage.sender",
    //     select: "fname lname email",
    // });

    existingChat = await User.populate(existingChat, {
        path: "latestMessage.sender",
        select: "fname lname email",
      });
    
      if (existingChat.length > 0) {
        res.send(existingChat[0]);
      }else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        
    try{
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({_id:createdChat._id}).populate(
            'users',
            '-password'
        );
        res.status(200).json(fullChat);
    }
    catch(error){
        res.status(400).json(error.message);
    }
 }
}

//@description Fetch all chats for a user
//@route       GET / api/chat/
//@access      protected

const fetchChats = async(req,res)=>{
    try {
       const results = Chat.find({users:{ $elemMatch: { $eq: req.user._id}}})
        .populate("users","-password")
        .populate("latestMessage")
        .sort({ updatedAt : -1 })

          const populatedResults = await User.populate(results,{
                path: "latestMessage.sender",
                select: 'fname lname email',
            });
            res.status(200).send(populatedResults);
        }catch (error) {
            console.log(error.message)
            res.status(500).json({message: "Internal Server Error"});
    };
}

export {startChat,fetchChats}
