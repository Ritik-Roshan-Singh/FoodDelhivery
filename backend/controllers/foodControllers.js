import foodModel from "../models/foodModel.js";
import fs from "fs";


//add food item

const addFood= async(req, res) => {

    if(!req.body.name || req.body.name.trim() === ""){
        return res.status(400).json({success: false, message: "Food name is required"})
    }
    if(!req.body.price || Number(req.body.price) <= 0){
        return res.status(400).json({success: false, message: "Price must be a positive number"})
    }

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })

    try{
        await food.save();
        res.json({
            success: true,
            message: "Food Item added successfully"
        })
    } catch (error) {
        res.json({success: false, message: "Error adding food item"})
    }

}

//all food list
const listFood = async (req, res) => {
    try{
        const foods = await foodModel.find({})
        res.json({
            success: true,
            data: foods
        })
    }
    catch (error) {
        res.json({success: false, message: "Error fetching food items"})
    }
}

// remove food item
const removeFood = async (req, res) => {
    try{
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, (err) => {
            if(err) console.log(err);
        });
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({
            success: true,
            message: "Food Item removed successfully"
        })


    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Error removing food item"}) 
    }
}

export {addFood , listFood, removeFood}
