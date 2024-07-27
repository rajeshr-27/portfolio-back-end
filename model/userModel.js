const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true, unique: true},
    username:{type:String,required:true, unique: true},
    mobile_number:{type:String,required:true},
    password:{type:String,required:true},
    gender:{type:String,required:true},
    dob:{type:String,required:true},
    country:{type:Number, ref:'Country',required:true},
    state:{type:Number,ref:'State',required:true},
    city:{type:Number,ref:'City'},
    pincode:{type:String,required:true},
    profile_type:{type:String,required:true}    
},
{
    timestamps :true
}) 

const User = mongoose.model('users',  userSchema);

module.exports = User;