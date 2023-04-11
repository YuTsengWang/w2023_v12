const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user model
const userSchema = new Schema (
    {
        "username": {
            type: String,
            unique: true},
        "password": String,
        "firstname": String,
        "lastname": String,
        "email": {
            type: String,
            unique: true},
        "isAdmin": Boolean
    }
);

module.exports = mongoose.model("users", userSchema);