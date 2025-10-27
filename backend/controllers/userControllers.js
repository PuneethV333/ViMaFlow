const User = require("../models/user");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

const generateAiTextWithGemini = async (answers) => {
  const { q1, q2, q3, q4, q5, q6 } = answers;

  const prompt = `
You are a career guidance AI. Based on the following user preferences, generate a short personalized tech career path.
Keep it concise, inspiring, and specific (3–4 lines).

1️⃣ Enjoys: ${q1}
2️⃣ Prefers: ${q2}
3️⃣ Interested in: ${q3}
4️⃣ Tech Stack: ${q4}
5️⃣ Thinking Style: ${q5}
6️⃣ Goal: ${q6}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (err) {
    console.error("🚫 Gemini SDK error:", err.message || err);
    if (err.status === 404) {
      console.error(
        "Model not found. Check available models via genAI.listModels()."
      );
    }
    return "AI service temporarily unavailable. Please try again later.";
  }
};

const parseCareerPath = (text) => {
  const titleMatch = text.match(/\*\*(.*?)\*\*/);
  const title = titleMatch ? titleMatch[1] : "Career Path";

  const description = text.replace(/\*\*(.*?)\*\*/, "").trim();

  const skills = [];
  if (text.includes("Python")) skills.push("Python");
  if (text.includes("TensorFlow")) skills.push("TensorFlow");
  if (text.includes("Pandas")) skills.push("Pandas");
  if (text.includes("Jupyter")) skills.push("Jupyter Notebooks");

  return { title, description, skills };
};

const signInViaEmail = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error fetching user" });
  }
};

const createUser = async ({ email, displayName, firebaseUid }) => {
  const existingUser = await User.findOne({ firebaseUid });
  if (existingUser) return null;
  const user = new User({ firebaseUid, displayName, email });
  await user.save();
  return user;
};

const signUpViaEmail = async (req, res) => {
  try {
    const { email, firebaseUid, displayName } = req.body;
    if (!email || !firebaseUid || !displayName)
      return res.status(400).json({ message: "Enter all the fields" });

    const user = await createUser({ email, displayName, firebaseUid });
    if (!user) return res.status(400).json({ message: "User already exists" });

    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ message: "Server error adding user" });
  }
};

const viaGoogle = async (req, res) => {
  try {
    const { email, displayName, firebaseUid } = req.body;
    if (!email || !firebaseUid || !displayName)
      return res.status(400).json({ message: "Enter all the fields" });

    const user = await createUser({ email, displayName, firebaseUid });
    if (!user) return res.status(400).json({ message: "User already exists" });

    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding Google user:", err);
    res.status(500).json({ message: "Server error adding Google user" });
  }
};

const viaGit = async (req, res) => {
  try {
    const { email, displayName, firebaseUid } = req.body;
    if (!email || !firebaseUid || !displayName)
      return res.status(400).json({ message: "Enter all the fields" });

    const user = await createUser({ email, displayName, firebaseUid });
    if (!user) return res.status(400).json({ message: "User already exists" });

    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding GitHub user:", err);
    res.status(500).json({ message: "Server error adding GitHub user" });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    const { imageUrl, userid } = req.body;
    if (!imageUrl || !userid)
      return res.status(400).json({ message: "Enter all the fields" });

    const user = await User.findByIdAndUpdate(
      userid,
      { profilePic: imageUrl },
      { new: true, select: "_id displayName email profilePic" }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile picture updated", user });
  } catch (err) {
    console.error("Error updating profile pic:", err);
    res.status(500).json({ message: "Server error while updating image" });
  }
};

const updateBios = async (req, res) => {
  try {
    const { bio, userid } = req.body;
    if (!bio || !userid)
      return res.status(400).json({ message: "Enter all the fields" });

    const user = await User.findByIdAndUpdate(
      userid,
      { bio },
      { new: true, select: "_id displayName email bio" }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Bio updated", user });
  } catch (err) {
    console.error("Error updating bios:", err);
    res.status(500).json({ message: "Server error while updating bio" });
  }
};

const updateAiGeneratedPath = async (req, res) => {
  try {
    const { answers, userid } = req.body;

    if (!answers || Object.keys(answers).length === 0)
      return res.status(400).json({ message: "Answer all questions" });

    if (!userid)
      return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ message: "User not found" });

    const rawPath = await generateAiTextWithGemini(answers);
    const parsed = parseCareerPath(rawPath);

    user.aiGeneratedPath = {
      raw: rawPath,
      title: parsed.title,
      description: parsed.description,
      skills: parsed.skills,
    };

    await user.save();

    res.status(200).json({
      message: "AI generated path updated",
      path: user.aiGeneratedPath,
      user: { _id: user._id, aiGeneratedPath: user.aiGeneratedPath },
    });
  } catch (err) {
    console.error("🔥 Error in updateAiGeneratedPath:", err);
    res.status(500).json({
      message: "Server error updating AI generated path",
      error: err.message,
    });
  }
};

const cleanJson = (text) =>
  text.replace(/```json|```/g, "").replace(/[\u0000-\u001F]+/g, "").trim();

const generateAiReview = async (data) => {
  const safeResume = data.slice(0, 10000); 
  const prompt = `
You are a professional resume reviewer.
Return the response strictly in valid JSON (no text outside JSON):

{
  "score": number,
  "strengths": [string],
  "suggestions": [string],
  "atsFlags": [string]
}

Resume:
${safeResume}
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = cleanJson(response.text());

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("⚠️ JSON parse error. Raw:", text);
      return {
        score: 0,
        strengths: ["Could not parse AI response."],
        suggestions: ["Try re-uploading resume."],
        atsFlags: [],
      };
    }
  } catch (err) {
    console.error("🚫 Gemini SDK error:", err.message || err);
    return {
      score: 0,
      strengths: [],
      suggestions: ["AI service temporarily unavailable."],
      atsFlags: [],
    };
  }
};

const reviewResume = async (req, res) => {
  try {
    const { firebaseUid } = req.user || {};
    const { resumeData, pdfUrl } = req.body;

    if (!firebaseUid) return res.status(401).json({ message: "Unauthorized" });
    if (!resumeData) return res.status(400).json({ message: "Missing resume data" });

    const aiReview = await generateAiReview(resumeData);

    const summaryText = resumeData.split(" ").slice(0, 200).join(" ");
    const review = {
      resumeText: summaryText,
      pdfUrl: pdfUrl || "",
      score: aiReview.score,
      strengths: aiReview.strengths,
      suggestions: aiReview.suggestions,
      atsFlags: aiReview.atsFlags,
      reviewedAt: new Date(),
    };

    const user = await User.findOne({ firebaseUid }).select("resumeReviews");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.resumeReviews.push(review);
    await user.save();

    console.log(review);
    

    res.status(200).json({
      success: true,
      message: "Resume reviewed successfully",
      data: review,
    });
  } catch (err) {
    console.error("🔥 Error reviewing resume:", err);
    res.status(500).json({
      success: false,
      message: "Server error reviewing resume",
      error: err.message,
    });
  }
};



module.exports = {
  getAllUser,
  signInViaEmail,
  signUpViaEmail,
  viaGoogle,
  viaGit,
  updateProfilePic,
  updateBios,
  updateAiGeneratedPath,
  reviewResume
};
