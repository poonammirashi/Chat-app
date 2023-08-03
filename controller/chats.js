const Chats = require("../models/chats");

exports.addmessage = async (req,res,next) => {
    try {
        const {message} = req.body ;
        console.log(req.user)
        const msg = await req.user.createChat({message});
        res.status(200).json({suuceess: "suuceess",message: msg});
    } 
    catch(err) {
        console.log(err);
        res.status(400).json(err);
    }
}

exports.getmessages = async (req,res,next) => {
    try {
        const messages = await Chats.findAll();
        res.status(200).json({success:"true", messages});
    }
    catch (err) {
        console.log(err);
        res.status(400).json({success: "false",err})
    }
}