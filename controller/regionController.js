const asyncHandler = require('express-async-handler');
const Country = require('../model/countryModel');
const State = require('../model/stateModel');
const City = require('../model/cityModel');
const fs = require('fs');


// const countries = [
//     { id: 1, name: 'USA' },
//     { id: 2, name: 'Canada' },
//     { id: 3, name: 'India' },
//   ];

// const states = {
//     1: [{ id: 1, name: 'California' }, { id: 2, name: 'Texas' }],
//     2: [{ id: 3, name: 'Ontario' }, { id: 4, name: 'Quebec' }],
//     3: [{ id: 5, name: 'Tamilnadu' }, { id: 6, name: 'Kerala' }],
    
//   };
  
// const cities = {
//     1: [{ id: 1, name: 'Los Angeles' }, { id: 2, name: 'San Francisco' }],
//     2: [{ id: 3, name: 'Houston' }, { id: 4, name: 'Dallas' }],
//     3: [{ id: 5, name: 'Toronto' }, { id: 6, name: 'Ottawa' }],
//     4: [{ id: 7, name: 'Montreal' }, { id: 8, name: 'Quebec City' }],
//     5: [{ id: 9, name: 'Chennai' }, { id: 10, name: 'Erode' }],
//   };
//Desc Get Countries
//Metho GET /api/region/countries
//public

const getCountries = asyncHandler( async (req,res)=>{

    const countries = await Country.find({}).sort({name:1});
    console.log('fetch country')
    res.status(200).json({
        status:1,
        countries,
        message:'Fetch countries success'
    })
})

//Desc Get States
//Metho GET /api/region/states
//public

const getStates = asyncHandler( async (req,res)=>{
    const { countryId } = req.params;
    const states = await State.find({country_id:countryId}).sort({name:1});
    res.status(200).json({
        status:1,
        states,
        message:'Fetch states success'
    })
})

//Desc Get Cities
//Metho GET /api/region/cities
//public

const getCities = asyncHandler( async (req,res)=>{
    const { stateId } = req.params;
    const cities = await City.find({state_id:stateId}).sort({name:1});
    res.status(200).json({
        status:1,
        cities,
        message:'Fetch cities success'
    })
})

const seedDatas = asyncHandler ( async(req,res) => {

    // const country_path  = './datas/countries.json';

    // const json_data = fs.readFileSync(country_path, 'utf-8')
    // const data = JSON.parse(json_data);

    // await Country.insertMany(data);

    // const state_path  = './datas/states.json';

    // const json_data = fs.readFileSync(state_path, 'utf-8')
    // const data = JSON.parse(json_data);

    // await State.insertMany(data);

    //  const city_path  = './datas/cities.json';

    // const json_data = fs.readFileSync(city_path, 'utf-8')
    //  const data = JSON.parse(json_data);

    //  await City.insertMany(data);

    //await Country.deleteMany({});

    //Clear existing data
    //await Country.deleteMany()

    // const india = new Country({name:'India'});
    // await india.save();

    // const tamilnadu = new State({name:'Tamil Nadu', countryId:india._id})
    // const kerala = new State({name:'Kerala', countryId:india._id})

    // await tamilnadu.save();
    // await kerala.save();

    // const chennai = new City({name:'Chennai', stateId:tamilnadu._id})
    // const erode = new City({name:'Erode', stateId:tamilnadu._id});

    // await chennai.save();
    // await erode.save();
 
    res.status(200).json({
        status:1,
        message:"Successfully seeded datas"
    })
})



module.exports = {getCountries, getStates, getCities, seedDatas};