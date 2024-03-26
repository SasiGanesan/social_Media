import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import Chat from '../model/chatModel.js';

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const getallMessages = async(req,res)=>{
    try {
        //get all messages from particular chat using ChatId 
        const messages = await Message.find({chat:req.params.id})
        .populate("sender", "fname lname email")
        .populate("chat");
        return res.json(messages);
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = async(req,res)=>{
    const {content,chatId}=req.body;
    if(!content || !chatId){
        return res.status(400).json({message: "Invalid data"})
    }
    var newMessage = {
        sender: req.user._id,
        content: content,//text
        chat: chatId,//chatId is unique
    };
    try{
        //start a new message using chatId and chatId populate from chat, 
        // Users populate from user using their userId 
        // latestMessage nothing but 
        // it is a what is the last message (It's call latest message)
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "fname")
        message =await message.populate("chat")
        message = await User.populate(message,{
            path: 'chat.users_id',
        });
        await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage: message});
        return res.status(200).json(message)
    }catch(error){
        res.status(500).json(error.message)
    }
}


export {getallMessages, sendMessage}
