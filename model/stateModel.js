const mongoose = require('mongoose');
const StateSchema = mongoose.Schema({
   id: {type:Number},
    name: {type:String},
    country_id: {type:Number},
    country_code: {type:String},
    country_name: {type:String},
    state_code: {type:String},
    type: {type:String},
    latitude: {type:String},
    longitude: {type:String}
});
module.exports = mongoose.model('State', StateSchema);