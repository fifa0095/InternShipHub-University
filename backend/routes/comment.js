const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment');

router.post('/comments', CommentController.createComment);

router.get('/comments', CommentController.getComments);

router.get('/comments/:id', CommentController.getCommentById);

router.get('/comments/blog/:blog_id', CommentController.getCommentsByBlogId);

router.put('/comments/:id', CommentController.updateComment);

router.delete('/comments/:id', CommentController.deleteComment);

module.exports = router;