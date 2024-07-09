const express= require('express'); 
require('dotenv').config()
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/dbConnection');
connectDB();
const app = express();
app.use(express.static(path.join(__dirname + "/public")))
app.use(cors());
app.use((req,res,next) => {
    if(req.headers.host.slice(0,4) !== 'www.'){
        res.redirect(301,'https://www.'+req.headers.host + req.url);
    }else {
        next();
    }
})
app.use('/api', express.static('uploads'));
app.use('/api/user', require('./route/userRoute'));
app.use('/api/region', require('./route/regionRoute'));

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,'/public','index.html'))
})
// app.use((err,req,res,next)=> {
//     console.log(err);
// }) 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('node server connected:',PORT)
})