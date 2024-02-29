import jwt from 'jsonwebtoken';

const generateToken = (res, userId)=>{
     // Create a JWT token with the user ID, using a secret and setting an expiration time of 30 days
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'30d',
    })

      // Set JWT as HTTP-Only cookie
      res.cookie('jwt', token, {
        httpOnly: true, // Cookie accessible only through HTTP(S) requests
        secure: process.env.NODE_ENV !== 'development', // Set to true in production to send the cookie over HTTPS
        sameSite: 'strict',// Restricts the cookie to be sent in same-site requests
        maxAge: 30 * 24 * 60 * 60* 1000 // 30 days
    })
}

export default generateToken;

