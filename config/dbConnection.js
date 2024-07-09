const mongoose = require('mongoose');

const connectDB = async () => { 
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log('Mongo db connectted:', connect.connection.name)
        const db = connect.connection;
        console.log(db.name);
    }catch(err){
        console.log(err)
    }
}


module.exports = connectDB;