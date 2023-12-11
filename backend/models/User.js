const mongoose =require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new mongoose.Schema({
    username:String,
    phoneNumber:String,
    expireAt: { type: Date },
    sessionCount: { type: Number, default: 0 },
    chats: [
        {
            customer: {type: String , default:"uiui"},
            admin: {type: String , default:""},
            timestamp: { type: Date, default: Date.now }
        }
    ]
})

userSchema.plugin(passportLocalMongoose);

const User=new mongoose.model("User",userSchema);

module.exports=User