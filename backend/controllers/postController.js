import Post from '../model/postModel.js';
import multer from 'multer';
import path from 'path';


//multer middleware to save uploaded files to the ./upload/images directory. 
//The filenames are constructed based on the original filename, a timestamp, 
//and the original file extension
//diskStorage = localStorage
//cb-callback function
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({
    storage:storage,
    limits:{
        fileSize:10*1024*1024 //10MB
    }
});

const createPost = async(req,res)=>{
    upload.single('imageUrl')(req,res,async(err)=>{
        try{
            // It checks if an error occurred during file upload.
            if(err instanceof multer.MulterError){
                return res.status(400).json({message:err.message})
            }else if(err){
                return res.status(500).json({message:"Error uploading file"});
            }
            // it checks if the uploaded file (req.file) exists and has a filename
            if(!req.file || !req.file.filename){
                return res.status (400).json({message:"Please upload an image" });
            }
            // const user=req.body
            const { userId,caption } = req.body;
            const imageUrl = `${req.file.filename}`;
            
            const newPost = await Post.create({
                userId,
                imageUrl,
                caption
            });
            return res.status(200).json(newPost);

        }catch(error){
            console.log(error.message);
            return res.status(500).json({message: 'Internal Server Error' });
        }
    })
}

const getPostByUserId = async (req, res) => {
 const userId = req.params.id;
    try {
        //
        const post = await Post.find({userId});
        if (post.length > 0) {
            return res.status(200).json(post);
        } else {
            return res.status(400).json({message: "This user has no posts or is not allowed to see posts" });
        }
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error" });
    }
};

export {createPost , getPostByUserId}




















// const upload = multer({
//     dest: './upload/images',
// })

// app.post("/uploads", upload.single('ImageUrl'),(req,res)=>{
//     console.log(req.file);

// })
//Multer setup for handling image uploads
//Store the image in memory
// const storage =multer.diskStorage({
//     destination: './upload/images',
//     filename(req,file,cb)=>{
//         return cb(null, `${file.fieldname}_${Date.now}
//         `)
//     }
// })

// export {createPost}

// const user = await User.findById(req.user.id).select('-password');

        // //create a new post
        // // const newPost = new Post({
        // //     user: req.user.id,
        // //     ImageUrl: req.body.ImageUrl,
        // //     caption:req.body.caption,
        // // });

        // // //save the post to the database
        // // const post = await newPost.save();
        // // res.status(200).json(post);
        // // if(!imageUrl){
        // //     return res.status(400).json({message: "Please enter an image url"})
        // // }
        // // let newImage = new Post({
        // //     id,
        // //     imageUrl,
        // //     caption
        // // });
        // // newImage=await newImage.save();
        // // res.json(newImage);
        // const storage = multer.memoryStorage();
        // const upload = multer({storage:storage}).single('imageUrl');
        // //Method : post
        // const createPost = async (req,res)=>{
        //     upload(req,res,async(err)=>{
        //         if(err){
        //             console.log(err)
        //             return res.status(500).send("Error uploading file");
        //         }
              
        //     })
            
        //     try {
        //         if(!req.file || !req.file.buffer){
        //             return res.status(400).json({message: "please upload an image"})
        //         }
        
        //         const { id, caption } = req.body;
        
        //       const imageUrl = req.file.buffer.toString('base64')
            
        //      const newPost = new Post({
        //         id,
        //         imageUrl,
        //         caption
        //      });
        //      const savePost = await newPost.save();
        //      res.status(200).json(savePost);
        
        //     } catch (error) {
        //         console.log(error.message);
        //         res.status(500).send('Internal Server Error');
        //     }
        // }
        