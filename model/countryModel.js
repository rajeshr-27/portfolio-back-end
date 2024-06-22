const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  id: { type: Number },
  name: { type: String },
  iso3: { type: String },
  iso2: { type: String },
  numeric_code: { type: String },
  phone_code: { type: String },
  capital: { type: String },
  currency:{ type: String },
  currency_name: { type: String },
  currency_symbol: { type: String },
  tld: { type: String },
  native:{ type: String },
  region: { type: String },
  region_id: { type: String },
  subregion: { type: String },
  subregion_id: { type: String },
  nationality: { type: String },
  timezones: [
    {
        zoneName:   String,
        gmtOffset: String ,
        gmtOffsetName: String,
        abbreviation:String ,
        tzName: String
    }
],
});

module.exports = mongoose.model('Country', countrySchema);