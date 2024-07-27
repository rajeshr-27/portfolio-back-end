const asyncHandler = require('express-async-handler');
const multer = require('multer');
const User = require('../model/userModel');
const UserBio = require('../model/userBioModel')
const crypto = require('crypto');
const util = require('util');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null, 'uploads/')
    },
    filename:(req,file,cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage});

//Desc Get Users
//Method GET /api/user/list
//Access private
const getUsers = asyncHandler(async(req,res) => {
    const userList = await User.aggregate([
        {
            $lookup:{
                from:`countries`,
                localField:'country',
                foreignField:'id',
                as:'country_data'
            }
        },
        {
            $lookup:{
                from:'states',
                localField:'state',
                foreignField:'id',
                as:'state_data'
            }           
        },
        {
            $lookup:{
                from:'cities',
                localField:'city',
                foreignField:'id',
                as:'city_data'
            }
        }
    ]);
    res.status(200).json({
        status:1,
        message:'Successfully fetched user',
        userList
    })
})
//Desc Get User Details
//Method GET /api/user/:id
//Access private
const getUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    const user = await User.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(id)}
        },
        {
            $lookup:{
                from:`countries`,
                localField:'country',
                foreignField:'id',
                as:'country_data'
            }
        },
        {
            $lookup:{
                from:'states',
                localField:'state',
                foreignField:'id',
                as:'state_data'
            }           
        },
        {
            $lookup:{
                from:'cities',
                localField:'city',
                foreignField:'id',
                as:'city_data'
            }
        },
        {
            $limit : 1
        }
    ]);
    res.status(200).json({
        status:1,
        message:'Successfully fetched user',
        user
    }) 
})

//Desc Add user
//Method POST /api/user/
//Access public
const addUser = asyncHandler(async(req,res) => {
   // const postData = req.body;
    const postData = JSON.parse(req.body.data);

    const {name,email,password,username,mobile_number, gender, dob, country,state,city,pincode,profile_type} = postData;
    if(!name || !email || !password || !username || !mobile_number || !gender || !dob || !country || !state  || !pincode || !profile_type){
        res.status(400);
        throw new Error('Please enter the required fields');
    }
    if(!city){
        post.city = null;
    }
    //check user exist or not
    const userInfo = await User.findOne({email});
    if(userInfo){
        res.status(400);
        throw new Error('Email already exist');
    }

      //check user exist or not
    const userInfoByUsername = await User.findOne({username});
      if(userInfoByUsername){
          res.status(400);
          throw new Error('Username already exist');
      }
    //passwrord ecrypt
    const pbkdf2 = util.promisify(crypto.pbkdf2);
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await pbkdf2(password, salt,10000,64, 'sha512');
    const hashPassword = `${salt}:${hash.toString('hex')}`;
    postData.password = hashPassword;
    //Add the user
    await User.create(postData);
    res.status(200).json({
        status:1,
        message:'Successfully added user'
    })
})

//Desc Update User
//Method PUT /api/user/:id
//Access private
const updateUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    //check user exist or not
    const userInfo = await User.findById(id);
    if(!userInfo){
        res.status(400);
        throw new Error('User not exist');
    }
    //const postData = req.body;
    const postData = JSON.parse(req.body.data);
    const {name,email,username,mobile_number, gender, dob, country,state,city,pincode,profile_type} = postData;
    if(!name || !email || !username ||  !mobile_number || !gender || !dob || !country || !state || !pincode || !profile_type){
        res.status(400);
        throw new Error('Please enter the required fields');
    }
    if(!city){
        post.city = null;
    }
    //check email
    const userInfoByEmail = await User.findOne({email});
    if(userInfoByEmail && userInfoByEmail._id != id){
        res.status(400);
        throw new Error('Email already exist');
    }

    //check username
    const userInfoByUsername = await User.findOne({username});
    if(userInfoByUsername && userInfoByUsername._id != id){
        res.status(400);
        throw new Error('Username already exist');
    }

    //Update user
    await User.findByIdAndUpdate(id,postData);

    res.status(200).json({
        status:1,
        message:'Successfully updated user'
    })
})
 
//Desc Login
//Method POST /api/user/login
//Access private
const loginUser = asyncHandler(async(req,res) => {
    let postData;
    if(req.body.data){
        postData = JSON.parse(req.body.data);
    }else {
        postData = req.body;
    }
    
    const {email,password} =postData;
    //check user
    const userInfo = await User.findOne({email});
    if(!userInfo){
        res.status(400);
        throw new Error('User not exist');
    }
    const pbkdf2 = util.promisify(crypto.pbkdf2);
    const storedHash = userInfo.password;
    const [salt,key] = storedHash.split(':');
    const hash = await pbkdf2(password, salt, 10000, 64, 'sha512');
    if(key === hash.toString('hex')){
        //login success
        const user = {
            _id:userInfo._id,
            name:userInfo.name,
            email:userInfo.email,
            username:userInfo.username,
            mobile_number:userInfo.mobile_number
        }
        const token = jwt.sign({
            user
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '10 m'
        })

        const refreshToken = jwt.sign({
            user
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '20 m'
        })
        const json_data = {
            status:1,
            message:"login success",
            token:token,
            refreshToken:refreshToken,
            authUser:user
        }
        res.status(200).json(json_data);
    }else {
        //login failed
        res.status(400)
        throw new Error('Email or Password Invalid');
    }

    res.status(200).json({
        status:1,
        message:'Successfully loggedin user'
    })
})

//Desc get bio details
//Method GET /api/user/bio-data/:userId
//Access public

const getBio = asyncHandler(async(req,res) => {
    const {username} = req.params;
    //get userinfor
    const userInfo = await User.findOne({username});
    if(!userInfo){
        res.status(404);
        throw new Error('User not exist');
    }
    const userId = userInfo._id
    const bioInfo = await UserBio.aggregate([
        {
            $match:{userId: new mongoose.Types.ObjectId(userId)}
        },{
            $lookup:{
                from:'users',
                localField:'userId',
                foreignField:'_id',
                as:'user_data'
            }
        },{
            $limit:1
        }
    ]);
    if(bioInfo.length === 0){
        res.status(400);
        throw new Error('user not exist');
    }
    res.status(200).json({
        status:1,
        message:'Fetch success',
        biodata:bioInfo
    })
})

//Desc Add Bio Data
//Method Post /api/user/add-bio-data
//Access public
const addBio = asyncHandler(async(req,res)=>{
   // const postData = req.body;
   const postData = JSON.parse(req.body.data);
    const {summary} = postData; 
    if(!req.file){
        res.status(400);
        throw new Error('Please enter required fields');
    }
    if(req.file){
        postData.photo = req.file.filename;
    }
    //Add bio
    await UserBio.create(postData);

    res.status(200).json({
        status:1,
        message:"Bio data added successfully"
    })
})

//Desc Update Bio Data
//Method Post /api/user/add-bio-data
//Access public
const updateBio = asyncHandler(async(req,res)=>{

    const {id} = req.params;
   // const postData = req.body;
    const postData = JSON.parse(req.body.data);
    const {summary} = postData;
    // if(!summary){
    //     res.status(400);
    //     throw new Error('Please enter required fields');
    // }
    //bioInfo 
    const bioInfo =  await UserBio.findById(id);

    if(!bioInfo){
        res.status(400);
        throw new Error('Bio data not exist');
    }
    if(req.file){
        postData.photo = req.file.filename;
    }else {
        postData.photo = bioInfo.photo;

    }
    //Update bio
    await UserBio.findByIdAndUpdate(id,postData);

    res.status(200).json({
        status:1,
        message:"Bio data updated successfully"
    })
})


module.exports = {getUser,addUser,updateUser,loginUser, upload, getUsers, addBio, updateBio, getBio}