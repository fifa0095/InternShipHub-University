const express = require('express')
const router = express.Router()

const {createBlog , getAllBlog  , deleteBlog , editBlog , searchBlogs , getReview, getBlogByPage} = require('../controllers/blog')

// call at  http://localhost:8080/api/create (sned ONLY JSON with POST method)
router.post('/createBlog', createBlog)

router.get('/getAllBlog', getAllBlog)

router.get('/getBlog/:page', getBlogByPage)

router.get('/getReview', getReview)

router.put('/updateBlog', editBlog)

router.delete('/deleteBlog', deleteBlog)

router.get('/search/:keyword', searchBlogs)

module.exports = router