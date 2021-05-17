const express = require('express')
const bookSchema = require('../model/book')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

const storage = multer.diskStorage(
    {
        destination : function (req, file, cb){
            cb(null, './uploads')
        },
        filename : function (req, file, cb){
            cb(null, file.originalname)
        }
    }
)

const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/jpeg' || file.originalname === 'image/png'){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
}

const upload = multer(
    {
        storage : storage,
        limit : {
            filesize : 1024*1024*5
        },
        fileFilter : fileFilter
    }
)


// total get book
router.get('/', checkAuth, async (req, res) => {
    try{
        const books = await bookSchema.find()
            .populate('user', ['email'])

        res.json({
            msg : "get books",
            count : books.length,
            bookInfo : books.map(book => {
                return{
                    id : book._id,
                    user : book.user,
                    bookImage : book.bookImage,
                    titles : book.titles,
                    date : book.createdAt
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

// detail get book
router.get('/:bookId', checkAuth, async (req, res) => {

    const id = req.params.bookId

    try{
        const book = await bookSchema.findById(id)
            .populate('user', ['email'])

        res.json({
            msg : "get book",
            bookInfo : {
                id : book._id,
                user : book.user,
                bookImage : book.bookImage,
                titles : book.titles
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// register book
router.post('/', checkAuth, upload.single('bookImage'), (req, res) => {

    const {user, titles} = req.body

    const newBook = new bookSchema({
        user,
        titles,
        bookImage : req.file.path
    })

    newBook
        .save()
        .then(book => {
            res.json({
                msg : "register book",
                bookInfo : {
                    id : book._id,
                    user : book.user,
                    bookImage : book.bookImage,
                    title : book.titles,
                    date : book.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: err.message
            })
        })
})

// update book
router.patch('/:bookId', checkAuth, async (req, res) => {

    const id = req.params.bookId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{
        await bookSchema.findByIdAndUpdate(id, {$set : updateOps})

        res.json({
            msg : "update book by " + id
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail delete book
router.delete('/:bookId', checkAuth, async (req, res) => {

    const id = req.params.bookId

    try{
        await bookSchema.findByIdAndRemove(id)

        res.json({
            msg : "delete book by " + id
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})


module.exports = router