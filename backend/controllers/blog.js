const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
    try {

        const existingBlog = await Blog.findOne({ title: req.body.title });

        if (existingBlog) {
            return res.status(400).json({ error: 'Blog with this title already exists' });
        }

        
        const blog = new Blog(req.body);
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        console.error("Error Saving Blog:", error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.getAllBlog = async (req, res) => {
    try {
        const blog = await Blog.find({ 
            type: { $in: ["auto_news", "user_blogs"] }
        });
        res.status(200).json(blog);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }

};

exports.getBlogByPage = async (req, res) => {
    try {
      const page = parseInt(req.params.page) || 1;
      const limit = 15;
      const skip = (page - 1) * limit;
  
      const blogs = await Blog.find()
        .sort({ createdAt: -1 }) // latest first
        .skip(skip)
        .limit(limit);
  
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.getReview = async (req, res) => {
    try {
        const blog = await Blog.find({ 
            type: "company_reviews" 
        });
        res.status(200).json(blog);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }

};

exports.editBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(blog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchBlogs = async (req, res) => {
  try {
    const { keyword } = req.params;
        if (!keyword) {
            return res.status(400).json({ message: 'Keyword is required' });
        }

        const keywordRegex = new RegExp(keyword, "i");

        console.log(keywordRegex);

        // const blogs = await Blog.find({title: { $regex: keywordRegex }});
        // const blogs = await Blog.find({company_name: { $regex: keywordRegex }});
        // const blogs = await Blog.aggregate([
        //   {
        //     $addFields: {
        //       tagsArray: {
        //         $cond: [
        //           { $eq: [{ $type: "$tags" }, "object"] },
        //           { $objectToArray: "$tags" },
        //           []
        //         ]
        //       }
        //     }
        //   },
        //   {
        //     $unwind: {
        //       path: "$tagsArray",
        //       preserveNullAndEmptyArrays: true
        //     }
        //   },
        //   {
        //     $match: {
        //       $or: [
        //         { "tagsArray.k": { $regex: keywordRegex } },
        //         { "tagsArray.v": { $regex: keywordRegex } },
        //         {
        //           $expr: {
        //             $and: [
        //               { $eq: [{ $type: "$tagsArray.v" }, "array"] },
        //               {
        //                 $gt: [
        //                   {
        //                     $size: {
        //                       $filter: {
        //                         input: "$tagsArray.v",
        //                         as: "tagValue",
        //                         cond: { $regexMatch: { input: "$$tagValue", regex: keywordRegex } }
        //                       }
        //                     }
        //                   },
        //                   0
        //                 ]
        //               }
        //             ]
        //           }
        //         }
        //       ]
        //     }
        //   },
        //   {
        //     $project: {
        //       title: 1,
        //       content: 1,
        //       tags: 1
        //     }
        //   }
        // ]);

        const blogs = await Blog.aggregate([
          {
            $addFields: {
              tagsArray: {
                $cond: [
                  { $eq: [{ $type: "$tags" }, "object"] },
                  { $objectToArray: "$tags" },
                  []
                ]
              }
            }
          },
          {
            $unwind: {
              path: "$tagsArray",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: {
              $or: [
                { title: { $regex: keywordRegex } },
                { company_name: { $regex: keywordRegex } },
                { "tagsArray.k": { $regex: keywordRegex } },
                { "tagsArray.v": { $regex: keywordRegex } },
                {
                  $expr: {
                    $and: [
                      { $eq: [{ $type: "$tagsArray.v" }, "array"] },
                      {
                        $gt: [
                          {
                            $size: {
                              $filter: {
                                input: "$tagsArray.v",
                                as: "tagValue",
                                cond: { $regexMatch: { input: "$$tagValue", regex: keywordRegex } }
                              }
                            }
                          },
                          0
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          },
          // {
          //   $project: {
          //     title: 1,
          //     content: 1,
          //     company_name: 1,
          //     tags: 1
          //   }
          // }
        ]);
        
        res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// exports.searchBlogs = async (req, res) => {
//     try {
//         const { keyword } = req.params;
//         if (!keyword) {
//             return res.status(400).json({ message: 'Keyword is required' });
//         }

//         const keywordRegex = new RegExp(keyword, "i");

//         console.log(keywordRegex);
//         const blogs = await Blog.aggregate([
//           {
//             $match: {
//               $or: [
//                 { title: { $regex: keywordRegex } },
//                 { company_name: { $regex: keywordRegex } }
//               ]
//             }
//           },
//           {
//             $addFields: {
//               tagsArray: { $objectToArray: "$tags" }
//             }
//           },
//           {
//             $match: {
//               $expr: {
//                 $gt: [
//                   {
//                     $size: {
//                       $filter: {
//                         input: "$tagsArray",
//                         as: "tagItem",
//                         cond: {
//                           $or: [
//                             { $regexMatch: { input: "$$tagItem.k", regex: keywordRegex } },
//                             {
//                               $and: [
//                                 { $isArray: "$$tagItem.v" },
//                                 {
//                                   $gt: [
//                                     {
//                                       $size: {
//                                         $filter: {
//                                           input: "$$tagItem.v",
//                                           as: "tagValue",
//                                           cond: {
//                                             $regexMatch: { input: "$$tagValue", regex: keywordRegex }
//                                           }
//                                         }
//                                       }
//                                     },
//                                     0
//                                   ]
//                                 }
//                               ]
//                             }
//                           ]
//                         }
//                       }
//                     }
//                   },
//                   0
//                 ]
//               }
//             }
//           }
//         ]).collation({ locale: 'th', strength: 1 });


//         res.json(blogs);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };