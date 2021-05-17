const bookSchema = require('../model/book')

exports.books_get_all = async (req, res) => {
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
};

exports.books_get_book = async (req, res) => {

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
};

exports.books_post_book = (req, res) => {

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
};

exports.books_patch_book = async (req, res) => {

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
};

exports.books_delete_book = async (req, res) => {

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
};

