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
        // This is a logical operator that combines multiple conditions using a logical AND operation. 
        // It's used here to ensure that both conditions within it are met.
       
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
          ],
        // $elemMatch operator to specify a condition that should be met by at least one element of the users array. 
        // This condition ensures that the chat involves the currently authenticated user (req.user._id)
    })
    .populate("users", "-password") //populate users from user except password
    .populate("latestMessage"); //current message is from particular chat

    //check the existingChat 
    existingChat = await User.populate(existingChat, {
        path: "latestMessage.sender",
        select: "fname lname email",
      });
    
      if (existingChat.length > 0) {
        res.send(existingChat[0]);
      }else{
        var chatData = {
            chatName: "sender",
            users: [req.user._id, userId],
        };
        
    try{
        //create a new chatId for new two users
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({_id:createdChat._id}).populate(
            'users',
            '-password'
        );
        res.status(200).json(fullChat);
    }
    catch(error){
        res.status(400).json(error.message);
        console.log(error.message)
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
        .sort({ updatedAt : -1 })//fetch chat from latest(last) chat

          const populatedResults = await User.populate(results,{
                path: "latestMessage.sender",
                select: 'fname lname email',
            });
            return res.status(200).send(populatedResults);
        }catch (error) {
            console.log(error.message)
            return res.status(500).json({message: "Internal Server Error"});
    };
}

export {startChat,fetchChats}
