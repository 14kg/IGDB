const mongoose = require("mongoose")

let User = mongoose.model("user", {
    username: String,
    email: String,
    password: String,
    comments: [String],
    reviews: [String],
    playlists: [String] 
})

module.exports = {
    User
}