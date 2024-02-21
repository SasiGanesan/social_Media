import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user:{
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
});

const Post = mongoose.model('Post',postSchema);
export default Post;

