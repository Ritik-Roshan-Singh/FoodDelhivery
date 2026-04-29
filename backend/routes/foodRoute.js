import express from "express";
import { addFood, listFood, removeFood} from "../controllers/foodControllers.js";
//image storeage system
import multer from "multer";
import { adminMiddleware } from "../middleware/auth.js";


const foodRouter = express.Router();


//image storage engine
const storage =multer.diskStorage({
    destination:"uploads",
    filename:(req, file, cb) =>{
        return cb(null, `${Date.now()}-${file.originalname}`)

    }
})

const uploads = multer({storage: storage})


foodRouter.post("/add", adminMiddleware, uploads.single("image"), addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove", adminMiddleware, removeFood)




export default foodRouter;