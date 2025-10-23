const Project = require('../models/projects');


const getProjectDate = async (req, res) => {
  try {
    const { userid } = req.params; 
    console.log("Fetching projects for user:", userid);

    const projects = await Project.find({ userId: userid });

    if (!projects || projects.length === 0) {
      return res.status(200).json([]); 
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).json({ message: "Server error fetching projects" });
  }
};

module.exports = { getProjectDate };
