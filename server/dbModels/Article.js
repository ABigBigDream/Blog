const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    title: String,
    body: String,
    // cover: String,
    comments:[
        {
            body:String, //评论的内容
            data:{
                type: Date,
                default: Date.now
            }
        }
    ],
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Article', userSchema);