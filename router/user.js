const express = require('express')
const userModel = require('../model/user')
const jwt = require('jsonwebtoken')
const router = express.Router()

// get userInfo

// detail get userInfo

// sign up
router.post('/signup', async (req, res) => {

    const {name, email, nickname, password} = req.body

    try{
        const user = await userModel.findOne({email})
        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else if(user){
            const user = await user.findOne({nickname})
            if(user){
                return res.status(401).json({
                    msg : "user nickname, please other nickname"
                })
            }
        }
        else{
            const user = new userModel(
                {
                    name, email, nickname, password
                }
            )

            await user.save()

            res.json({user})
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// login
router.post('/login', async (req, res) => {

    const {nickname, password} = req.body

    try{
        const user = await userModel.findOne({nickname})
        if(!user){
            return res.status(402).json({
                msg : "user nickname, please other nickname"
            })
        }
        else{
            await user.comparePassword(password, (err, isMatch) => {
                if(err || !isMatch){
                    return res.status(403).json({
                        msg : "not match password"
                    })
                }
                else{
                    const payload = {
                        id : user._id,
                        email : user.email
                    }

                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {expiresIn: '1h'}
                    )

                    res.json({token})
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

// update userInfo

// detail delete userInfo

module.exports = router