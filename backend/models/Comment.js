 const mongoose = require('mongoose');
 
 const CommentSchema = new mongoose.Schema({
    blog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: Array, required: true },
 }, { 
     timestamps: true 
     
 }); // Automatically adds createdAt & updatedAt
 
 module.exports = mongoose.model('Comment', CommentSchema);
 