const express = require('express')

const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const {
    books_delete_book,
    books_get_all,
    books_get_book,
    books_patch_book,
    books_post_book
} = require('../controller/book')
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
router.get('/', checkAuth, books_get_all)

// detail get book
router.get('/:bookId', checkAuth, books_get_book)

// register book
router.post('/', checkAuth, upload.single('bookImage'), books_post_book)

// update book
router.patch('/:bookId', checkAuth, books_patch_book)

// detail delete book
router.delete('/:bookId', checkAuth, books_delete_book)


module.exports = router