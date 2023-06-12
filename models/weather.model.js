const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
    city : String,
    currentWeather : String
})

const WeatherModel = mongoose.model("cityData",weatherSchema);

module.exports = WeatherModel;