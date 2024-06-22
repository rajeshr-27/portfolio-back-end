const express= require('express');
require('dotenv').config()
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const connectDB = require('./config/dbConnection');
connectDB();
const app = express();
app.use(cors());
app.use('/api', express.static('uploads'));
app.use('/api/user', require('./route/userRoute'));
app.use('/api/region', require('./route/regionRoute'));
// app.use((err,req,res,next)=> {
//     console.log(err);
// }) 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('node server connected:',PORT)
})