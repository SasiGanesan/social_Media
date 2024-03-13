import Joi from 'joi';

// User register Validation

const registerValidation = async(req,res,next)=>{
    const registerSchema = Joi.object({
        fname: Joi.string().min(4).max(10).required(),
        lname: Joi.string().min(1).max(10).required(),
        email: Joi.string().email().trim(true).required(),
        gender: Joi.string().required(),
        DOB: Joi.date().iso().required(),
        mobileNo: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
        password: Joi.string().required(),
        confirmPassword:Joi.string().required(),
        isAdmin:Joi.boolean(),
    });
    const {error} = await registerSchema.validate(req.body);
if(error){
    return res.status(400).json({
        message: error.message
    })
    }else{
    next();
    }
}

//User Login validation
const loginValidation = async(req,res,next)=>{
    const loginSchema = Joi.object({
        email: Joi.string().email().trim().required(),
        password: Joi.string().required(),
    });
    const {error} = await loginSchema.validate(req.body);
    if(error){
        return res.status(400).json({
            message: error.message
        })
    }else{
        next();
    }
};

//User logout validation
const logoutValidation = async(req,res,next)=>{
    const logoutSchema = Joi.object({
        email: Joi.string().email().trim().required(),
    });
    const {error} = await logoutSchema.validate(req.body);
    if(error){
        return res.status(400).json({
            message: error.message
        })
    }else{
        next();
    }
};


//Search User validation
const searchUserValidation=async(req,res,next)=>{
    const searchUserSchema=Joi.object({
        fname: Joi.string().required(),
    });
    const {error} = await searchUserSchema.validate(req.query);
    if(error){
        return res.status(400).json({
            message: error.message
        })
    }else{
        next();
    }
}

//Post validation


// One to One chat
const OneToOneChatValidation = async(req,res,next)=>{
    const chatSchema=Joi.object({
        userId : Joi.string().required(),
    });
    const {error} = await chatSchema.validate(req.body);
    if(error){
        return res.status(400).json({
            message: error.message
        })
    }else{
        next();
    }
}

//Post Image
const postImageValidation = async(req,res,next)=>{
    const imageSchema=Joi.object({
        // userId: Joi.string().required(),
        imageUrl: Joi.string().required(),
        caption:Joi.string().max(200),
    });
    const {error} = await imageSchema.validate(req.body);
    if(error){
        return res.status(400).json({
            message: error.message
        })
    }else{
        next();
    }
}


//Post Message
const messageValidation = async(req,res,next)=>{
    const messageSchema=Joi.object({
        chatId : Joi.string().required(),
        content: Joi.string().required()
    });
    const {error} = await messageSchema.validate(req.body);
    if(error){
        return res.status(400).json({
            message: error.message
        })
    }else{
        next();
    }
}


export {registerValidation,loginValidation,logoutValidation,searchUserValidation,postImageValidation,OneToOneChatValidation,messageValidation}



