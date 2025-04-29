const ml_path = "http://localhost:5001";
const User = require('../models/User');


exports.predictJob = async (req, res) => {
    try {
        const { uid, ...mlInput } = req.body;

        const response = await fetch(ml_path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mlInput),
        });

        const predicted_job = await response.text();

        const resumeEntry = {
            ...mlInput,
            predicted_job,
        };

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.resume.push(resumeEntry);
        await user.save();

        res.status(201).json(predicted_job);
    } catch (error) {
        console.error("Error in predictJob:", error.message);
        res.status(400).json({ error: error.message });
    }
};

// exports.predictJob = async (req, res) => {
//     try {

//         console.log(req.body);
        
//         const response = await fetch(ml_path, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(req.body),
//         });

//         const job = await response.text();
//         res.status(201).json(job);
//     } catch (error) {
//         console.error("Error Saving Blog:", error.message);
//         res.status(400).json({ error: error.message });
//     }
// };