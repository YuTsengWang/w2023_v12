const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const commentSchema = new Schema({
    comment: String,
    date: Date,
    user_name: String
});

const postSchema = new mongoose.Schema({
    "user_name": {type: String},
    "category_name": String,
    "comments": [commentSchema],
    "title": String,
    "description": String
});


module.exports = mongoose.model('posts', postSchema);



//Post = mongoose.model('post', postSchema);

//var testPost = 