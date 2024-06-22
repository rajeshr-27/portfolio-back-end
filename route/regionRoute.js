const express = require('express');
const { getCountries, getStates, getCities, seedDatas } = require('../controller/regionController');
const Router = express.Router();

Router.get('/countries', getCountries);
Router.get('/states/:countryId', getStates);
Router.get('/cities/:stateId', getCities);
Router.get('/seed', seedDatas);

module.exports = Router;