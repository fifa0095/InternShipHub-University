const express = require("express");
const blogRoutes = require("./routes/blog");
const commentRoutes = require("./routes/comment");
const mlRoutes = require("./routes/ml");
const pdfreaderRoutes = require("./routes/pdfreader");
const userRoutes = require("./routes/user");
const visualizeRoute = require("./routes/visualize");

const router = express.Router();

router.use(blogRoutes);
router.use(commentRoutes);
router.use(mlRoutes);
router.use(pdfreaderRoutes);
router.use(userRoutes);
router.use(visualizeRoute);

module.exports = router;