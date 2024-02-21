// import express from 'express';
import User from '../model/userModel.js';
import Post from '../model/postModel.js';
import multer from 'multer';
import path from 'path';

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
            if(err instanceof multer.MulterError){
                return res.status(400).json({success:0,message:err.message})
            }else if(err){
                return res.status(500).json({success:0, message:"Error uploading file"});
            }
            if(!req.file || !req.file.filename){
                return res.status (400).json({success:0,message:"Please upload an image" });
            }
            // const user=req.body
            const { user,caption } = req.body;
            const imageUrl = `http://localhost:4000/upload/${req.file.filename}`;
            
            const newPost = new Post({
                user,
                imageUrl,
                caption
            });

            const savedPost = await newPost.save();
            res.status(200).json({ success: 1, savedPost });

        }catch(error){
            console.log(error.message);
            res.status(500).json({ success: 0, message: 'Internal Server Error' });
        }
    })
}

export {createPost}




















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
        