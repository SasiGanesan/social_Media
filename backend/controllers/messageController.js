import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import Chat from '../model/chatModel.js';

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected

const getallMessages = async(req,res)=>{
    try {
        const messages = await Message.find({chat: req.params.chatId})
        .populate("sender", 'fname lname email')
        .populate('chat');
        res.json(messages);
    } catch (error) {
        res.status(400).json({message: "Sorry we can't find chat"})
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
        content: content,
        chat: chatId,
    };

    try{
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "fname lname email")
        message =await message.populate("chat")
        message = await User.populate(message,{
            path: 'chat.users',
            select: "fname lname "
        });
        return res.status(200).json(message)
    }catch(error){
        res.status(400).json(error.message)
    }
}


export {getallMessages, sendMessage}
