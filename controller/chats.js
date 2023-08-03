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