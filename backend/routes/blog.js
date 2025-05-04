const express = require('express')
const router = express.Router()

const BlogController = require('../controllers/blog')

router.post('/createBlog', BlogController.createBlog);

router.get('/getAllBlog', BlogController.getAllBlog)

router.get('/getBlog/:page', BlogController.getBlogByPage)

router.get('/getBlogByUid/:uid', BlogController.getBlogByUid)

router.get('/getBlogByBlogId/:blogid', BlogController.getBlogByBlogid)

router.get('/getReview', BlogController.getReview)

router.put('/updateBlog', BlogController.editBlog)

router.delete('/deleteBlog/:id', BlogController.deleteBlog)

router.get('/search/:keyword', BlogController.searchBlogs)

module.exports = router