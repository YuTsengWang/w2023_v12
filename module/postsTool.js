const fs = require('fs');
require('dotenv').config();
const mongoose = require("mongoose");
mongoose.connect(process.env.dbConn, { useNewUrlParser: true, useUnifiedTopology: true });

const UserModel = require("../models/userModel");
const IndustryModel = require("../models/jobIndustryModel");
const PostModel = require("../models/postModel");
var ObjectId = require('mongodb');

module.exports.getPostsByIndustry = function(ind){
    return new Promise((resolve, reject) => {
        //console.log(ind);
        PostModel.find({category_name:ind})
        .lean()
        .exec()
        .then((posts) => {
            console.log("Posts Obtained")
            //console.log(posts)
            resolve(posts)
        }).catch((err) => {
            console.log("No posts Obtained")
            reject(err);
        })

    })
}


module.exports.getPost = function (postID) {
    return new Promise((resolve, reject) => {

       // console.log(typeof postID);
        //console.log(postID);

        PostModel.find({ _id: postID})
            .lean()
            .exec()
            .then((post) => {
                resolve(post);

            })
            .catch(() => {
                //console.log("That user was not found!");
                //res.redirect("/admin/users");
                reject("Post was not found")
            })

    })


}
