const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
    try {

        const existingBlog = await Blog.findOne({ title: req.body.title });

        if (existingBlog) {
            return res.status(400).json({ error: 'Blog with this title already exists' });
        }

        
        const user = new Blog(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error("Error Saving Blog:", error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.getBlog = async (req, res) => {
    const blog = await Blog.find();
    res.json(blog);
};


exports.editBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(blog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete user
exports.deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
