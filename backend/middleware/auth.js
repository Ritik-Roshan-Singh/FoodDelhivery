import jwt from 'jsonwebtoken';

const authMiddleware = async(req, res, next) => {

    const {token} = req.headers;

    if(!token){
        return res.json({success:false, message:"Not authorized login again"})
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
        
    }


}

const adminMiddleware = async(req, res, next) => {

    const {token} = req.headers;

    if(!token){
        return res.json({success:false, message:"Not authorized login again"})
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!token_decode.isAdmin){
            return res.json({success:false, message:"Admin access required"})
        }
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }

}


export { adminMiddleware };
export default authMiddleware;
