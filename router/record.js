const express = require('express')

const checkAuth = require('../middleware/check-auth')
const {
    record_delete_record,
    record_patch_record,
    record_post_record,
    records_get_all,
    records_get_record
} = require('../controller/record')
const router = express.Router()

// total get record
router.get('/', checkAuth, records_get_all)

// detail get record
router.get('/:recordId', checkAuth, records_get_record)

// register record
router.post('/', checkAuth, record_post_record)

// update record
router.patch('/:recordId', checkAuth, record_patch_record)

// detail delete record
router.delete('/:recordId', checkAuth, record_delete_record)

module.exports = router