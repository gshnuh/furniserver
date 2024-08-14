
const mongoose = require("mongoose");
const StateSchema = new mongoose.Schema({
    id: {type: String},
    name: {type: String, unique: true},
    country_id: {type: String},
    country_code: {type: String},
    country_name: {type: String},
    state_code: {type: String},
    type: {type: String},
    latitude: {type: String},
    longitude: {type: String},
});

const State = mongoose.model("State", StateSchema);

module.exports = State;