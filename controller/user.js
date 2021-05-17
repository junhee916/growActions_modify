const userModel = require('../model/user')
const jwt = require('jsonwebtoken')

exports.users_get_all = (req, res) => {
    userModel
        .find()
        .then(users => {
            res.json({
                msg : "get userInfo",
                count : users.length,
                userInfo : users.map(user => {
                    return {
                        id : user._id,
                        name : user.name,
                        email : user.email,
                        password : user.password,
                        profileImage : user.profileImage,
                        rule : user.rule,
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
};

exports.users_get_user = async (req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findById(id)

        res.json({
            msg : "get user",
            userInfo : {
                id : user._id,
                name : user.name,
                email : user.email,
                password : user.password,
                profileImage : user.profileImage,
                rule : user.rule
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_signup_user = async (req, res) => {

    const {name, email, password} = req.body

    try{
        const user = await userModel.findOne({email})
        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            const user = new userModel(
                {
                    name, email, password
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
};

exports.users_login_user = async (req, res) => {

    const {email, password} = req.body

    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(402).json({
                msg : "user email, please other email"
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
};

exports.users_patch_user = async (req, res) => {

    const id = req.params.userId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{

        const user = await userModel.findByIdAndUpdate(id, {$set : updateOps})
        if(!user){
            res.status(403).json({
                msg : "no user id"
            })
        }
        else{
            res.json({
                msg : "update user by" + id
            })
        }

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_delete_user = async (req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findByIdAndRemove(id)
        if(!user){
            return res.status(403).json({
                msg : "no user id"
            })
        }
        else{
            res.json({
                msg : "delete user by " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_delete_all = (req, res) => {

    userModel
        .remove()
        .then(() => {
            res.json({
                msg : "delete users"
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
}