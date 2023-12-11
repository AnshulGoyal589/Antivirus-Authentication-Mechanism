const mongoose =require("mongoose");

const adminSchema=new mongoose.Schema({
    key:String
})

const Admin=new mongoose.model("Admin",adminSchema);

module.exports=Admin