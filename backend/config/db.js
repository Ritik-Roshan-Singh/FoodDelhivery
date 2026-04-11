//logic connect with database

import mongoose  from "mongoose";

 export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://ritikroshansingh06_db_user:YaRi2309@cluster0.vfvr2jd.mongodb.net/fooddelhivery').then(()=>
        console.log("DB connected"));

    }