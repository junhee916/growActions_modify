const express = require('express')
const commendModel = require('../model/commend')
const router = express.Router()

// detail get commend
router.get('/:commendId', async (req, res) => {

    const id = req.params.commendId
    try{
        const commend = await commendModel.findById(id)
            .populate('user', ['email'])
            .populate('record', ['record'])

        if(!commend){
            return res.status(402).json({
                msg : "no commend id"
            })
        }
        else{
            res.json({
                msg : "get commend",
                commendInfo : {
                    id : commend._id,
                    user : commend.user,
                    record : commend.record,
                    commend : commend.commend,
                    date : commend.createdAt
                }
            })
        }

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// register commend
router.post('/', async (req, res) => {

    const {user, record, commend} = req.body

    const newCommend = new commendModel({
        user, record, commend
    })
    try{
        const commend = await newCommend.save()
        res.json({
            msg : "register commend",
            commendInfo : {
                id : commend._id,
                user : commend.user,
                record : commend.record,
                commend : commend.commend,
                date : commend.createdAt
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg: err.message
        })
    }
})

// update commend
router.patch('/:commendId', async (req, res) => {

    const id = req.params.commendId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{
        const commend = await commendModel.findByIdAndUpdate(id, {$set : updateOps})
        if(!commend){
            return res.status(402).json({
                msg : "no commend id"
            })
        }
        else{
            res.json({
                msg : "update commend by " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail delete commend
router.delete('/:commendId', async (req, res) => {

    const id = req.params.commendId

    try{
        const commend = await commendModel.findByIdAndRemove(id)
        if(!commend){
            return res.status(402).json({
                msg : "no commend id"
            })
        }
        else{
            res.json({
                msg : "delete commend by " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

module.exports = router