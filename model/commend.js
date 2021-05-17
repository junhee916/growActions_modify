const mongoose = require('mongoose')

const commendSchema = mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
            default : "nonUser"
        },
        record : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'record',
            required: true
        },
        commend : {
            type : String
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('commend', commendSchema)