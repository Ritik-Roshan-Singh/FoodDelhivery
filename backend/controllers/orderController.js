import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import mongoose from "mongoose";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//placimg user order from frontend

const placeOrder = async (req, res) => {
const frontend_url = "http://localhost:5173";

    try {
         const neworder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address,
         
        })
        await neworder.save();

            // Create a Stripe Payment Intent
            const line_items = req.body.items.map(item => ({ 
                price_data: {
                    currency: 'usd',
                    product_data: {name: item.name},
                    unit_amount: Math.round(item.price * 100), // Convert to cents
                },
                quantity: item.quantity,
            }));
            line_items.push({
                price_data: {
                    currency: 'usd',
                    product_data:{
                        name: 'Delivery Charges'
                    },
                    unit_amount: Number(process.env.DELIVERY_CHARGE || 2) * 100, // Convert to cents
                },
                quantity: 1,
            });
            const session = await stripe.checkout.sessions.create({
                line_items:line_items,
                mode:'payment',
                success_url: `${frontend_url}/verify?success=true&orderId=${neworder._id}`,
                cancel_url: `${frontend_url}/verify?canceled=true&orderId=${neworder._id}`,
            });

            // Clear user's cart only after Stripe session is successfully created
            await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

               res.json({success:true, message:"Order Placed Successfully", session_url:session.url});

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }

}
const verifyOrder = async (req, res) => {
    const  {orderId, success} = req.body;

    if(!orderId || !mongoose.Types.ObjectId.isValid(orderId)){
        return res.status(400).json({success:false, message:"Invalid order ID"});
    }

    try {
        
        if(success === "true"){
            await orderModel.findByIdAndUpdate(orderId, {payment: "true"});
            res.json({success:true, message:"Payment Successful"});


        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false, message:"not paid"});
        }

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

// user orders
const userOrders = async (req, res) => { 
    try {
        const orders = await orderModel.find({ userId: req.body.userId });

        res.json({ success: true, data: orders }); // ✅ FIXED

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// listing all orders admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success:true, data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"}); 
        
    }


}

//api updatinng order status by admin
const updateOrderStatus = async (req, res) => {
    try {  
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status});
        res.json({success:true, message:"Status Updated"})
        


    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}


export {placeOrder, verifyOrder ,userOrders, listOrders, updateOrderStatus};
