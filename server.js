
//#region Server Setup
var tool = require("./module/tools.js")
var postTool = require("./module/postsTool.js")
var express = require("express");
var app = express();
const expressHbs = require("express-handlebars");
var HTTP_PORT = process.env.PORT || 8080;

require('dotenv').config();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));
app.use(express.static("public"));



const { engine } = require("express-handlebars");
app.use(async (req, res, next) => {
    try {
      const industries = await JobIndustryModel.find().lean();
      res.locals.industries = industries;
      next();
    } catch (error) {
      console.error("Error fetching industries for navbar:", error);
      res.locals.industries = [];
      next();
    }
  });
  
app.engine(
    "hbs",
    expressHbs.engine({
      extname: ".hbs",

      layoutsDir: "views/layouts/"
    })
  );
app.set('view engine', '.hbs');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const clientSession = require("client-sessions");
app.use(clientSession({
    cookieName: "Cap805Session",
    secret: "cap805_week8_mongodbDemo",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

// Mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.dbConn, { useNewUrlParser: true, useUnifiedTopology: true });

const UserModel = require("./models/userModel");
const JobIndustryModel = require("./models/jobIndustryModel.js");
const PostModel = require("./models/postModel.js");



//#endregion


//#region Custom Server Functions
function OnHttpStart() {
    console.log("Express server started successfully on port: " + HTTP_PORT);
}

function ensureLogin(req, res, next) {
    if (!req.Cap805Session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

function ensureAdmin(req, res, next) {
    if (!req.Cap805Session.user.isAdmin) {
        res.render("adminlogin", { errorMsg: "You do not have permissions for the page requested!"});
    } else {
        next();
    }
}


//#endregion

//#region ROUTES
app.get("/", (req, res) => {
    res.render("home", { user: req.Cap805Session.user })
});
app.get("/about", (req, res) => {
    res.render("about", { user: req.Cap805Session.user })
});
app.get("/contact", (req, res) => {
    res.render("contact", { user: req.Cap805Session.user })
});

//#region USER ROUTES
app.get("/login", (req, res) => {

    res.render("login", { user: req.Cap805Session.user })
});


app.get("/logout", (req, res) => {
    req.Cap805Session.reset();
    res.redirect("/")
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("login", { errorMsg: "Both the login and password are required fields" });
    }
    //auto authentication 
    tool.loginFieldCheck(username, password).then((resolve) => { //FUNCTION FOR TESTING --------------------

        req.Cap805Session.user = {
            username: resolve.user.username,
            email: resolve.user.email,
            isAdmin: resolve.user.isAdmin,
            firstname: resolve.user.firstname,
            lastname: resolve.user.lastname
        };

        res.redirect(resolve.nav);

    }).catch((reject) => {
        if (reject.errbol) {
            res.render("login", { errorMsg: reject.errstring });
        } else {
            console.log("Something went wrong!")
        }
    })






})

//auto  register
app.get("/register",(req, res) =>{
    res.render("register",{});
});

app.post("/register", (req,res) =>{

    const username = req.body.username;
    const password = req.body.password;
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    var user = {username,password,firstname,lastname,email}

    tool.registerCred(user)
  .then(() => {
    tool.registration(user)
      .then((resolve) => {
        console.log(resolve);
        res.redirect("/login");
      })
      .catch((reject) => {
        console.log(reject);
        if (reject.message === "already registered") {
          res.render("register", {
            errorMsg: "User is already registered!",
            
          });
        } else {
          res.render("register", {
            errorMsg: "Something went wrong!",
            
          });
        }
      });
  })
  .catch((reject) => {
    res.render("register", { errorMsg: reject });
  });
});


//#endregion

//#region USER Pages
//auto dashboard
app.get("/dashboard", ensureLogin, (req, res) => {
    res.render("dashboard", { user: req.Cap805Session.user })
});
//auto profile
app.get("/profile", ensureLogin, (req, res) => {
    res.render("profile", { user: req.Cap805Session.user })
});

//auto edituser
app.get("/profile/edit", ensureLogin, (req, res) => {
    res.render("profileedit", { user: req.Cap805Session.user })
});


//auto edituser
app.post("/profile/edit", ensureLogin, (req, res) => {
    const username = req.body.username;
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    tool.profileEditCred(username, firstname, lastname, email).then((resolve) => { //FUNCTION FOR TESTING --------------------------------------

        tool.profileEdit(username, firstname, lastname, email).then((resolve) => {//FUNCTION FOR TESTING ---------------------------------------------
            console.log(resolve);
            req.Cap805Session.user = {
                username: username,
                email: email,
                firstname: firstname,
                lastname: lastname
            };
            res.redirect("/Profile");
        }).catch((reject) => {
            console.log(reject);
        })



    }).catch((reject) => {


        res.render("profileedit", { user: req.Cap805Session.user, errorMsg: reject });

    })
})
//#endregion

//#region ADMIN Pages
app.get("/admin/dashboard", ensureAdmin, (req, res) => {
    res.render("adminDashboard", {
        user: req.Cap805Session.user,
        
    })
});

app.get("/admin/users", ensureAdmin, (req, res) => {

    tool.getAllUsers().then((resolve) => { //FUNCTION FOR TESTING -------------------
        res.render("adminUserManager", {
            user: req.Cap805Session.user,
            hasUsers: !!resolve.length,
            users: resolve,
            
        })

    }).catch((reject) => {
        console.log(reject);
    })
    
})

app.get("/admin/industries", ensureAdmin, (req, res) => {

    tool.getAllIndustries().then((resolve) => { 
        res.render("adminIndustryManager", {
        
        hasIndustries: !!resolve.length,
            industries: resolve,
            
        })

    }).catch((reject) => {
        console.log(reject);
    })
    
})

app.get("/admin/users/add", ensureAdmin, (req, res) => {
    res.render("adminUserEditor", {
        user: req.Cap805Session.user
        
    })
})

app.get("/admin/industries/add", ensureAdmin, (req, res) => {
    res.render("adminIndustryEditor", {
        user: req.Cap805Session.user
    })
})

app.get("/admin/users/edit", ensureAdmin, (req, res) => {
    res.render("adminUserEditor", {
        user: req.Cap805Session.user
        
    })
})




app.get("/admin/users/edit/:usrname", ensureAdmin, (req, res) => {
    const uname = req.params.usrname;

    tool.getUser(uname).then((resolve) => {//FUNCTION FOR TESTING -----------------------------
        res.render("adminUserEditor", {
            user: req.Cap805Session.user,
            usr: resolve,
            
        })
    }).catch((reject) => {
        console.log(reject);

    })

})


app.post("/admin/industries/add", ensureAdmin, (req, res) => {
    console.log("Add industry handler called");
    const industry = new JobIndustryModel({
        industry: req.body.industry,
    });

    industry.save((err) => {
        if (err) {
            console.log("An error occurred adding a new industry: " + industry.industry);
            console.log("Error details:", err); // <-- Add this line to log the error object
        } else {
            res.redirect("/admin/industries");
        }
    });
});



app.post("/admin/user/edit", ensureAdmin, (req, res) => {
    const usr = new UserModel({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.fname,
        lastname: req.body.lname,
        email: req.body.email,
        isAdmin: (req.body.isAdmin == "on")
    })

   
    // editing
    if (req.body.edit == "1") {
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
                if (err) console.log("An error occurred editing a user: " + usr.username);
            })
    }
    else // adding
    {
        usr.save((err) => {
            if (err) console.log("An error occurred adding a new user: " + usr.username)
        })
    }
    res.redirect("/admin/users");
})

// delete user
app.get("/admin/users/delete/:usrname", ensureAdmin, (req, res) => {
    const uname = req.params.usrname;
    UserModel.deleteOne({ username: uname })
        .then((err) => {
            if (err) console.log("An error occurred deleting user: " + uname);
            res.redirect("/admin/users");
        })
})

app.get("/admin/industries/delete/:indname", ensureAdmin, (req, res) => {
    const iname = req.params.indname;  
    JobIndustryModel.deleteOne({ industry: iname })
        .then(() => {
            res.redirect("/admin/industries");
            console.log("successful");
        })
        .catch((err) => {
            console.log("An error occurred deleting industry: " + iname);
            res.redirect("/admin/industries");
        });
});

app.get("/industry", (req, res) => {
    res.render("industry", { user: req.Cap805Session.user })
});

app.get("/industry/:ind", (req,res) =>{

    postTool.getPostsByIndustry(req.params.ind).then((resolve)=>{
        //console.log(resolve);

        res.render("industry", {
            industry: req.params.ind,
            posts : resolve,
            user: req.Cap805Session.user
        })

    }).catch((reject)=>{
        console.log(reject)
    })

})

app.get("/industry/:ind/addpost", ensureLogin,(req,res) =>{

    res.render("createPost", {
        industry: req.params.ind,
        user: req.Cap805Session.user
    })
})

app.post("/industry/addpost", ensureLogin,(req,res) =>{

    console.log("Add post called");
    const post = new PostModel({
        user_name: req.body.user_name,
        category_name: req.body.category_name,
        comments:[],
        title: req.body.title,
        description: req.body.title
    });

    post.save((err) => {
        if (err) {
            console.log("An error occurred adding a new post: ");
            console.log("Error details:", err); // <-- Add this line to log the error object
        } else {
            res.redirect("/industry/"+req.body.category_name);
        }
    });


})

app.get("/industry/:ind/:postid", (req,res) =>{

    //console.log(req.params.postid)

    postTool.getPost(req.params.postid).then((resolve)=>{
        //console.log(resolve[0].title)



        var isPosterUser = false;

        if(req.Cap805Session.user){
            if(resolve[0].user_name == req.Cap805Session.user.username){
                isPosterUser = true;
            }
        }
        //console.log(req.Cap805Session.user.username)
        //console.log(req.Cap805Session.user.isAdmin);



        res.render("post",{industry: req.params.ind,
            post:resolve[0],
            user: req.Cap805Session.user
        })

    }).catch((reject)=>{
        console.log(reject);
    })



})









  
  // Route to handle DELETE requests for removing industries (admin only)
  
  

app.listen(HTTP_PORT, OnHttpStart)
module.exports = { app };

