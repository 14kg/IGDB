const express = require("express")
const session = require("express-session")
const cookieparser = require("cookie-parser")
const hbs = require("hbs")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const MongoStore = require('connect-mongo')(session)

const {Game} = require("./models/game.js")
const {User} = require("./models/user.js")
const {Playlist} = require("./models/playlist.js")

const app = express()

const urlencoder = bodyparser.urlencoded({
    extended:true
})

mongoose.connect("mongodb://127.0.0.1:27017/games", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB...')).catch((err) => console.error("Coudn't connect MongoDB....", err));

const db = mongoose.connection

// // Handle 404
// app.use(function(req, res) {
//     res.status(400);
//    res.render('404', {title: '404: File Not Found'});
// });

// // Handle 500
// app.use(function(error, req, res, next) {
//     res.status(500);
//    res.render('500', {title:'500: Internal Server Error', error: error});
// });

app.use(cookieparser());
app.use(session({
    secret: 'my-igdb-69420',
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        secure: false,
        maxAge: 1000*60*60
    },
    store: new MongoStore({ mongooseConnection: db })
}));

//RETRIEVE ONE
// Game.findOne({
//     _id: "5f56ebbba57a9f2b5c599c48"
// }).then((doc)=>{
//     console.log(JSON.stringify(doc))
// }, (err)=>{
//     console.log(err)
// })

//RETRIEVE MANY
// Game.find({}).then((docs)=>{
//     for(let i = 0; i < docs.length; i++){
//         console.log(JSON.stringify(docs[i]))
//     }
// }, (err)=>{
//     console.log(err)
// })

//DELETE ONE
// Game.deleteOne({
//     _id: "5f56ebbba57a9f2b5c599c48"
// }).then((doc)=>{
//     console.log("Deleted " + doc.n + " document/s.")
// }, (err)=>{
//     console.log(err)
// })

//UPDATE
// Game.findOneAndUpdate({
//     _id:"5f6fa36ac3c15166edb89780"
// },{
//     title: "game5"
// },{
//     new: true
// }).then((doc)=>{
//      console.log("Updated " +JSON.stringify(doc))
// }, (err)=>{
//      console.log(err)
// })

app.set("view engine", "hbs")

app.use(express.static(__dirname + '/public'));

app.get("/", urlencoder, (req,res)=>{
    //access the main page
    console.log(req.session)
    if(req.session){
        let username  = req.session.username
        console.log(username)
        res.render("home.hbs", {username: username})
    }else{
        res.render("home.hbs", {})
    }
    
})

app.get("/database", urlencoder, (req,res)=>{
    //access the database page
    //load all games
    let admin = 0;
    if(req.session.username === "zezima"){
        admin = 1
    }
    Game.find({}).then((docs)=>{
        for(let i = 0; i < docs.length; i++){
            console.log(JSON.stringify(docs[i]))
        }
        console.log(JSON.stringify(docs))
        res.render("database.hbs", {docs:docs, admin:admin})
    }, (err)=>{
        console.log(err)
    })
})


app.get("/search", urlencoder, (req,res)=>{
    //access the database page
    if(req.query.search_select=="user"){
        //go to user page if exact match
        //optional: display closest match
        res.render("user_page.hbs", {})
    }else if(req.query.search_select=="game"){
        //go to game page if exact match
        //optional: display closest match
        res.render("game.hbs", {})
    }
})

app.get("/login", urlencoder, (req,res)=>{
    let username = req.body.username
    let password = req.body.password
    res.render("login.hbs", {})
})

app.get("/about", urlencoder, (req,res)=>{
    //go to log in page
    res.render("about.hbs", {})
})


app.get("/game", urlencoder, (req,res)=>{
    //view a game
    res.render("game.hbs", {})
})

app.get("/user_page", urlencoder, (req,res)=>{
    //view a user
    //if viewed user is not the same as logged in, hide options
    res.render("user_page.hbs", {})
})

app.get("/playlist", urlencoder, (req,res)=>{
    //view a playlist
    //if viewed playlist does not belong to logged in user, hide options
    res.render("playlist.hbs", {})
})

app.get("/review", urlencoder, (req,res)=>{
    //view a review

    res.render("review.hbs", {})
})

//========================
//ADD NEW GAME(ADMIN ONLY)
//========================
app.post("/database", urlencoder, (req,res)=>{
    //create a game

    if(req.body.title && req.body.genre && req.body.publisher && req.body.developer && req.body.year){
        let title = req.body.title
        if(req.body.art){
            let art = req.body.art
        }
        let genre = req.body.genre
        let publisher = req.body.publisher
        let developer = req.body.developer
        let year = req.body.year
        let description = req.body.description
        
        let game = new Game({
            title: title,
            genre: genre,
            publisher: publisher,
            developer: developer,
            year: year,
            description: description
        })
        
        //check existing
        Game.findOne({
            title: title
        }).then((doc)=>{
            if(!doc){
                game.save().then((doc)=>{//add async
                    console.log("===GAME ADDED===")
                }, (err)=>{
                    console.log("Error: "+ err)
                })
            }else{
                console.log("===EXISTING TITLE===")
            }
        }, (err)=>{
            console.log(err)
        })
    }else{
        console.log("===MISSING FIELDS===")
    }
    res.redirect("/database");
})

app.post("/db_edit", urlencoder, (req,res)=>{
    //edit game from database

    res.render("database.hbs", {})
})

app.post("/db_delete", urlencoder, (req,res)=>{
    //delete game from database

    res.render("database.hbs", {})
})
//====================
//COMMENTS AND REVIEWS
//====================
app.post("/comment", urlencoder, (req,res)=>{
    //create a comment
    let comment = req.body.comment
    let user_id = req.body.user_id

    res.render("review.hbs", {})
})

app.post("/review", urlencoder, (req,res)=>{
    //create a review
    let title = req.body.title
    let game_id = req.body.game_id
    let user_id = req.body.user_id
    let rating = req.body.rating
    let review = req.body.review

    res.render("review.hbs", {})
})

//===================
//PLAYLIST OPERATIONS
//===================
app.post("/playlist", urlencoder, (req,res)=>{
    //create a playlist
    console.log(req.session.user_id)

    if(req.body.title && req.body.private && req.session.user_id && req.body.description){
        let title = req.body.title
        let private = false
        if(req.body.private = "True"){
            private = true
        }else{
            private = false
        }
        let user_id = req.session.user_id
        let description = req.body.description
        
        console.log("boolin "+private)

        let playlist = new Playlist({
            title: title,
            private: private,
            user_id: user_id,
            description: description
        })
        
        //push new playlist to the array
        User.findOne({
            _id: user_id
        }).then((doc)=>{
            if(doc.playlists){
                console.log("Playlist? "+doc.playlists)
                doc.playlists.push(playlist)
                doc.save()
                playlist.save()
                console.log("===PLAYLIST ADDED===")
            }else{
                doc.playlists[0] = playlist
                doc.save()
                playlists.save()
                console.log("===FIRST PLAYLIST ADDED===")
            }
        }, (err)=>{
            console.log(err)
        })
    }else{
        console.log("===MISSING PLAYLIST FIELDS===")
    }
    res.render("playlist.hbs", {})
})

app.post("/playlist_add", urlencoder, (req,res)=>{
    //add game to playlist
    let game = req.body.game

    res.render("playlist.hbs", {})
})

//=============================
//USER LOGGING AND REGISTRATION
//=============================
app.post("/login", urlencoder, (req,res)=>{
    //user log in
    let username = req.body.username
    let password = req.body.password

    //search database for username match
    User.findOne({
        username: username
    }).then((doc)=>{
        if(doc){
            console.log(JSON.stringify(doc))
            //check if password matches
            if(doc.password === password){
                req.session.username = username
                req.session.user_id = doc._id
                req.session.loggedin = true
                console.log("===SIGNED IN===")
                res.render("home.hbs", {username: username})
            }else{
                console.log("===WRONG PASSWORD===")
                let error = "Wrong password."
                res.render("login.hbs", {error: error})
            }
        }else{
            let error = "User does not exist."
            res.render("login.hbs", {error: error})
        }
    }, (err)=>{
        console.log(err)
    })
})

app.get("/logout", urlencoder, (req,res)=>{
    //delete session
    req.session.destroy(function() {
        req.session = null
        console.log("===SIGNED OUT===")
        res.redirect("/");
    });
})

app.post("/register", urlencoder, (req,res)=>{
    //register as a user
    if(req.body.username && req.body.password && req.body.email){
        let username = req.body.username //check if unique
        let password = req.body.password
        let email = req.body.email
        
        let user = new User({
            username: username,
            password: password,
            email: email
        })
        
        //check existing
        User.findOne({
            username: username
        }).then((doc)=>{
            if(!doc){
                user.save().then((doc)=>{//add async
                    console.log("===USER REGISTERED===")
                }, (err)=>{
                    console.log("Error: "+ err)
                })
            }else{
                console.log("===USERNAME TAKEN===")
            }
        }, (err)=>{
            console.log(err)
        })
    }else{
        console.log("===MISSING FIELDS===")
    }

    res.redirect("/login");
})

app.post("/forgotpassword", urlencoder, (req,res)=>{
    //retrieve forgotten password
    let username = req.body.username //check if match
    let email = req.body.email

    res.render("home.hbs", {})
})


app.listen(3000, function(){
    console.log("Listening to port 3000")
})
