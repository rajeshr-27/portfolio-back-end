const mongoose = require('mongoose');

const userBioSchema = mongoose.Schema({
    photo:{
        type:String,
        required:true
    },
    summary:{
        type:String
    },
    portfolio:{
        type:String
    },
    github:{
        type:String
    },
    linkedin:{
        type:String
    },
    instagram:{
        type:String
    },
    ebook:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},
{
    timestamps : true
});

module.exports = mongoose.model('UserBio',userBioSchema);