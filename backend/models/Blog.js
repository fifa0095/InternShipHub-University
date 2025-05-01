const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company_name: { type: String, required: true },
    content: { type: Array, required: true },
    type: { type: String, required: true },
    tags: { type: Object, required: true },
    src_from: { type: String, required: true },
    banner_link: { type: String, required: false }, // Added banner_link field
}, { 
    timestamps: true 
    
}); // Automatically adds createdAt & updatedAt

module.exports = mongoose.model('Blog', BlogSchema);
