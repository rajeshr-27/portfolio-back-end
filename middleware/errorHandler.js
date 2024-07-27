const errorHandler = (err,req,res,next) => {
    const status = res.statusCode || 500;

    switch(status){
        case 400:
            res.json({
                title:"Validation error",
                message:err.message,
                stackTrace : err.stack
            })
        case 401:
            res.json({
                title:"UnAuthenticated",
                message:err.message,
                stackTrace : err.stack
            })
        case 500:
            res.json({
                title:"Internale server error",
                message:err.message,
                stackTrace : err.stack
            })
        default : 
        if(err){
            console.log(err)
        }else {
            console.log('no error');
        }
       
    }
}
module.exports = errorHandler;