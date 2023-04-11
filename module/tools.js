const fs = require('fs');
require('dotenv').config();
const mongoose = require("mongoose");
mongoose.connect(process.env.dbConn, { useNewUrlParser: true, useUnifiedTopology: true });

const UserModel = require("../models/userModel");
const IndustryModel = require("../models/jobIndustryModel");



module.exports.loginFieldCheck = function (username, password) {
    return new Promise((resolve, reject) => {



        // go to database
        UserModel.findOne({ username: username })
            .exec()
            .then((usr) => {
                // check username
                var errbol = false;
                var errstring = "";
                if (usr) {
                    if (password === usr.password) {

                        var nav = ""
                        var user = usr;
                        if (usr.isAdmin) {
                            //res.redirect("/admin/dashboard");
                            nav = "/admin/dashboard"
                            data = { nav, user }
                            resolve(data);
                        } else {
                            // res.redirect("/dashboard");
                            nav = "/dashboard"
                            data = { nav, user }
                            resolve(data);
                        }
                        console.log("Login was successful");
                    } else {
                        //res.render("login", { errorMsg: "User credentials are incorrect! Password was incorrect", layout: false });
                        errstring = "User credentials are incorrect! Password was incorrect";
                        errbol = true;
                        error = { errstring, errbol }
                        reject(error);

                    }
                } else {
                    //res.render("login", { errorMsg: "User credentials are incorrect! Login was not found", layout: false });
                    errstring = "User credentials are incorrect! Login was not found";
                    errbol = true;
                    error = { errstring, errbol }
                    reject(error);
                }
            })
            .catch((err) => {
                console.log("An error occurred: ${err}" + err)
                error = { err, errbol };
                reject(error);
            });


    })
}


module.exports.profileEditCred = function (username, firstname, lastname, email) {
    return new Promise((resolve, reject) => {
        if (username === "" || firstname === "" || lastname === "" || email === "") {
            reject("Missing Credentials");
        } else {
            resolve();
        }
    })
}


module.exports.profileEdit = function (username, firstname, lastname, email) {
    return new Promise((resolve, reject) => {

        UserModel.updateOne({ username: username }, {
            $set: {
                firstname: firstname,
                lastname: lastname,
                email: email
            }
        })
            .exec()
            .then(() => {
                resolve("Update operation successful");
            })
            .catch((err) => {
                reject(err);
            })

    })
}

module.exports.getAllUsers = function () {
    return new Promise((resolve, reject) => {
        UserModel.find()
            .lean()
            .exec()
            .then((users) => {
                console.log("Users obtained")
                resolve(users)
            }).catch((err) => {
                reject(err);
            })
    })


}

module.exports.getAllIndustries = function () {
    return new Promise((resolve, reject) => {
        IndustryModel.find()
            .lean()
            .exec()
            .then((industries) => {
                console.log("Industries obtained")
                resolve(industries)
            }).catch((err) => {
                reject(err);
            })
    })


}




module.exports.getUser = function (uname) {
    return new Promise((resolve, reject) => {

        UserModel.findOne({ username: uname })
            .lean()
            .exec()
            .then((usr) => {
                resolve(usr);

            })
            .catch(() => {
                //console.log("That user was not found!");
                //res.redirect("/admin/users");
                reject("That user was not found!")
            })

    })


}


module.exports.checkUserCreds = function (usr) {
    return new Promise((resolve, reject) => {
        if(usr.username === "" || usr.password === "" ||usr.firstname === "" ||usr.lastname === "" ||usr.email === "" ){
            reject("Missing Credentials")
        }else{
            resolve();
        }


    })


}



module.exports.edittingUsers = function (usr, edit) {
    return new Promise((resolve, reject) => {
        // editing
        if (edit == "1") {
            UserModel.updateOne({ username: usr.username }, {
                $set: {
                    username: usr.username,
                    firstname: usr.firstname,
                    lastname: usr.lastname,
                    email: usr.email,
                    isAdmin: usr.isAdmin
                }
            })
                .exec().then((err) => {
                    if (err) {
                        //console.log("An error occurred editing a user: " + usr.username);
                        reject("An error occurred editing a user: " + usr.username)
                    }
                    else {
                        resolve("Edit successful")

                    }
                })
        }
        else // adding
        {
            usr.save((err) => {
                if (err) {
                    //console.log("An error occurred editing a user: " + usr.username);
                    reject(err);
                }
                else {
                    resolve("User created");

                }
            })
        }


    })


}

module.exports.registerCred = function (usr) {
    return new Promise((resolve, reject) => {

        if(usr.username === "" || usr.password === "" ||usr.firstname === "" ||usr.lastname === "" ||usr.email === "" ){
            reject("Missing Credentials")
        }else{
            resolve("Has all creds");
        }
    })
}

module.exports.registration = function (usr) {
    return new Promise((resolve, reject) => {
      console.log(usr);
  
      // Check if a user with the same username or email already exists
      UserModel.findOne({ $or: [{ username: usr.username }, { email: usr.email }] }, (err, existingUser) => {
        if (err) {
          reject(err);
        } else if (existingUser) {
          reject(new Error('already registered'));
        } else {
          // Proceed with user registration (save user to the database)
          var user = new UserModel({
            username: usr.username,
            password: usr.password,
            firstname: usr.firstname,
            lastname: usr.lastname,
            email: usr.email,
            isAdmin: false,
          });
  
          user.save()
            .then(() => {
              resolve("Successfully added");
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }
      });
    });
  };
  


