const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    _id: String,
    comment: String,
    review_id: String
})

const reviewSchema = new mongoose.Schema({
    _id: String,
    title: String,
    game_id: String,
    rating: Number,
    review: String,
    upvote: Number,
    downvote: Number,
    comments: [commentSchema]
})

let Review = mongoose.model("review", reviewSchema)

module.exports = {
    Review
}