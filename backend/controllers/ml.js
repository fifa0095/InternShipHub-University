// ml path config
const ml_path = "http://localhost:5001";


exports.predictJob = async (req, res) => {
    try {

        console.log(req.body);
        
        const response = await fetch(ml_path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const job = await response.text();
        res.status(201).json(job);
    } catch (error) {
        console.error("Error Saving Blog:", error.message);
        res.status(400).json({ error: error.message });
    }
};