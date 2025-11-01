const Project = require("../models/projects");
const User = require("../models/user");

const getProjectDate = async (req, res) => {
  try {
    const { userid } = req.params;

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

const addProjects = async (req, res) => {
  try {
    console.log("📥 Incoming project request body:", req.body);
    console.log("👤 Authenticated user:", req.user);

    const firebaseUid = req.user?.firebaseUid;
    if (!firebaseUid) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing Firebase UID" });
    }

    const { title, description, image, technologies, githublink, livelink } =
      req.body;

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!title || !description || !technologies) {
      return res
        .status(400)
        .json({
          message: "Title, description, and technologies are required.",
        });
    }

    const technologieArray = Array.isArray(technologies)
      ? technologies.map((t) => t.trim())
      : technologies.split(",").map((t) => t.trim());

    const newProject = new Project({
      title: title.trim(),
      description: description.trim(),
      technologies: technologieArray,
      image: image?.trim() || "",
      githublink: githublink?.trim() || "",
      livelink: livelink?.trim() || "",
      userId: user._id,
    });

    await newProject.save();

    res.status(201).json({
      message: "✅ Project added successfully!",
      project: newProject,
    });
  } catch (err) {
    console.error("🔥 Error adding project:", err);

    if (err.code === 11000) {
      const dupField = Object.keys(err.keyPattern || {})[0];
      return res.status(409).json({
        message: `${dupField} already exists.`,
        error: err.message,
      });
    }

    res.status(500).json({
      message: "Server error while adding project",
      error: err.message,
    });
  }
};

module.exports = { getProjectDate, addProjects };
