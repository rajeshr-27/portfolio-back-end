const express = require('express');
const { getUser, addUser, updateUser, loginUser,upload, getUsers, addBio, updateBio, getBio } = require('../controller/userController');
const validateToken = require('../middleware/validateToken');
const validateRefreshToken = require('../middleware/validateRefreshToken');
 
const Router = express.Router();

//get users
Router.get('/list', getUsers)
//get user details
Router.get('/:id',getUser);
//Add user 
Router.post('/',upload.none(),addUser)
//Update user
Router.put('/:id',upload.none(),validateToken,updateUser);
//Login User
Router.post('/login', upload.none(),loginUser);
//Auth User
Router.get('/auth-user/details', validateToken , (req,res)=> {
    res.status(200).json({
        status:1,
        message:"success",
        authUser:req.user
    })
});
//Refresh token
Router.get('/refresh-token/details', validateRefreshToken, (req,res)=> {
    res.status(200).json({
        status:1,
        message:"success",
        token:req.token,
        refreshToken: req.refreshToken,
        authUser:req.user
    })
});

//Add Bio data

Router.post('/add-bio-data',upload.single('photo'), validateToken, addBio);
Router.put('/update-bio-data/:id', upload.single('photo'), validateToken, updateBio);
Router.get('/bio-data/:username', getBio);

module.exports = Router;  