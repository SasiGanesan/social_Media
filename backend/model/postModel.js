import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl:{
        type: String,
        required: true,
    },
    caption:{
        type: String,
        default : '',
    },
},{
    timestamps:true
});

const Post = mongoose.model('Post',postSchema);
export default Post;

