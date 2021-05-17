const express = require('express')
const recordModel = require('../model/record')
const router = express.Router()

// total get record
router.get('/', async (req, res) => {

    try{
        const records = await recordModel.find()
            .populate('user', ['email'])
            .populate('book','bookImage')

        res.json({
            msg : "get records",
            count : records.length,
            recordInfo : records.map(record => {
                return{
                    id : record._id,
                    user : record.user,
                    book : record.book,
                    record : record.record,
                    date : record.createdAt
                }
            })
        })

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail get record
router.get('/:recordId', async (req, res) => {

    const id = req.params.recordId

    try{
        const record = await recordModel.findById(id)
            .populate('user', ['email'])
            .populate('book', ['bookImage'])

        res.json({
            msg : "get record",
            recordInfo : {
                id : record._id,
                user : record.user,
                book : record.book,
                record : record.record,
                date : record.createdAt
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// register record
router.post('/', async (req, res) => {

    const {user, book, record} = req.body

    const newRecord = new recordModel(
        {
            user, book, record
        }
    )

    try{
        const record = await newRecord.save()

        res.json({
            msg : "register record",
            recordInfo : {
                id : record._id,
                user : record.user,
                book : record.book,
                record : record.record,
                date : record.createdAt
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }

})

// update record
router.patch('/:recordId', async (req, res) => {

    const id = req.params.recordId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{
        await recordModel.findByIdAndUpdate(id, {$set : updateOps})

        res.json({
            msg : "update record by " + id
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail delete record
router.delete('/:recordId', async (req, res) => {

    const id = req.params.recordId

    try{
        await recordModel.findByIdAndRemove(id)

        res.json({
            msg : "delete record by " + id
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

module.exports = router