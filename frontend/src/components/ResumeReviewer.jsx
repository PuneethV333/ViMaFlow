import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import axios from "axios";
import pdfjsLib from "../pdfSetup";
import { toast } from "react-toastify";
import { Loader2, FileText, Upload, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ResumeReviewer = () => {
  const { user } = useContext(AuthContext);
  const [pdf, setPdf] = useState(null);
  const [review, setReview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const extractTextFromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      text += pageText + "\n";
    }
    return text;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return toast.error("File size must be < 5MB");
    if (!file.type.startsWith("application/pdf"))
      return toast.error("Select PDF file only");
    setPdf(file);
  };

  const handleReview = async () => {
    try {
      if (!pdf) return toast.error("Please upload your resume first!");

      toast.info("Uploading and reviewing resume...");
      setUploading(true);

      let pdfUrl = "";
      let text = "";

      if (pdf instanceof File) {
        const formData = new FormData();
        formData.append("file", pdf);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );

        const cloudRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
          formData
        );

        pdfUrl = cloudRes.data.secure_url;
        setUploading(false);
        text = await extractTextFromPdf(pdf);
        setAnalyzing(true);
      }

      const token = await user.getIdToken();

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/review`,
        { resumeData: text, pdfUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.data) {
        setReview(res.data.data);
        toast.success("AI review generated successfully!");
      } else {
        toast.error("AI review failed: No review data returned.");
      }

      setAnalyzing(false);
    } catch (err) {
      console.error("Error during review:", err);
      toast.error("Something went wrong while reviewing your resume.");
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#0A0F1C] min-h-screen flex flex-col items-center justify-center text-white px-4 py-8">
      <div className="w-full max-w-2xl bg-zinc-900/70 rounded-3xl shadow-2xl backdrop-blur-md border border-zinc-800 p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          <span className="bg-transparent" >🤖</span> AI Resume Reviewer
        </h1>

      
        <div className="flex flex-col items-center gap-4">
          <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-cyan-500 transition text-center">
            <Upload size={40} className="text-cyan-400 mb-2" />
            <span className="text-gray-300 text-sm sm:text-base">
              {pdf ? pdf.name : "Upload your resume (PDF only)"}
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              hidden
            />
          </label>

          <button
            onClick={handleReview}
            disabled={uploading || analyzing}
            className="bg-cyan-600 hover:bg-cyan-700 transition px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
          >
            {uploading || analyzing ? (
              <>
                <Loader2 className="animate-spin" />
                {uploading ? "Uploading..." : "Analyzing..."}
              </>
            ) : (
              <>
                <FileText />
                Submit for Review
              </>
            )}
          </button>
        </div>
      </div>

      =
      {review && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-cyan-700/40 overflow-y-auto max-h-[90vh]"
          >
            
            <button
              onClick={() => setReview(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
            >
              ✖
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
              🧠 AI Resume Review
            </h2>

            
            <div className="text-center mb-6">
              <p className="text-lg sm:text-xl font-semibold text-cyan-400">
                ⭐ Score:{" "}
                <span className="text-white">{review.score || "N/A"}</span> / 100
              </p>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-2 sm:h-4">
                <div
                  className="bg-cyan-400 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${review.score || 0}%` }}
                ></div>
              </div>
            </div>

            
            {review.strengths && (
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-green-400 flex items-center gap-2">
                  💪 Strengths
                </h3>
                <ul className="list-disc list-inside text-green-300 space-y-1 text-sm sm:text-base">
                  {review.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            
            {review.suggestions && (
              <div className="mt-5">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-yellow-400 flex items-center gap-2">
                  💡 Suggestions
                </h3>
                <ul className="list-disc list-inside text-yellow-200 space-y-1 text-sm sm:text-base">
                  {review.suggestions.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}

            
            {review.atsFlags && (
              <div className="mt-5">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-red-400 flex items-center gap-2">
                  ⚠️ ATS Flags
                </h3>
                <ul className="list-disc list-inside text-red-300 space-y-1 text-sm sm:text-base">
                  {review.atsFlags.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            
            <div className="flex justify-center mt-8 mb-2">
              <div className="flex items-center gap-2 text-cyan-400 text-lg sm:text-xl font-semibold">
                <CheckCircle className="text-cyan-400" size={22} />
                ✅ Review Completed
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ResumeReviewer;
