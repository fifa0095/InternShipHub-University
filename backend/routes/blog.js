const express = require('express')
const router = express.Router()

const {createBlog , getBlog  , deleteBlog , editBlog} = require('../controllers/blog')

// call at  http://localhost:8080/api/create (sned ONLY JSON with POST method)
router.post('/createBlog', createBlog)

router.get('/getBlog', getBlog)

router.put('/updateBlog', editBlog)

router.delete('/deleteBlog', deleteBlog)

module.exports = router