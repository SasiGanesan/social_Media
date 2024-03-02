import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import Chat from '../model/chatModel.js';

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const getallMessages = async(req,res)=>{
    try {
        const messages = await Message.find({chat:req.params.id})
        .populate("sender", "fname lname email")
        .populate("chat");
     res.json(messages);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = async(req,res)=>{
    const {chatId,content}=req.body;

    if(!content || !chatId){
        return res.status(400).json({message: "Invalid data"})
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try{
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "fname")
        message =await message.populate("chat")
        message = await User.populate(message,{
            path: 'chat.users_id',
            // select: "fname lname "
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage: message});

        return res.status(200).json(message)
    }catch(error){
        res.status(500).json(error.message)
    }
}


export {getallMessages, sendMessage}
