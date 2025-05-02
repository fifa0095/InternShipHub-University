const Comment = require('../models/Comment');
const User = require('../models/User');

const getUsernameForComments = async (Comments) => {
    if (!Array.isArray(Comments)) return Comments;
  
    const uid = [...new Set(Comments.map(comment => comment.uid?.toString()))];
  
    const users = await User.find({ _id: { $in: uid } }).lean();
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user.name;
    });
  
    return Comments.map(comment => {
      const plainComment = comment.toObject ? comment.toObject() : comment;
      return {
        ...plainComment,
        username: userMap[comment.uid?.toString()] || "Unknown"
      };
    });
  };
  
  

exports.createComment = async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        console.error("Error Saving Comment:", error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find()
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error Fetching Comments:", error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        console.error("Error Fetching Comment:", error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.getCommentsByBlogId = async (req, res) => {
    try {
        const comments = await Comment.find({ blog_id: req.params.blog_id })
        if (comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this blog' });
        }

        const enrichedComment = await getUsernameForComments(comments);

        res.status(200).json(enrichedComment);
    } catch (error) {
        console.error("Error Fetching Comments by Blog ID:", error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        console.error("Error Updating Comment:", error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error("Error Deleting Comment:", error.message);
        res.status(400).json({ error: error.message });
    }
};