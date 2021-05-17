const mongoose = require('mongoose')

const bookSchema = mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
            required : true
        },
        bookImage : {
            type : String,
            required : true
        },
        title : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('book', bookSchema)