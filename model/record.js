const mongoose = require('mongoose')

const recordSchema = mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
            required : true
        },
        book : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'book',
            required : true
        },
        record : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('record', recordSchema)