import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import axios from "axios";
import pdfjsLib from "../pdfSetup";
import { toast } from "react-toastify";
import { Loader2, FileText, Upload, CheckCircle } from "lucide-react";
import { gsap } from 'gsap'


const ResumeReviewer = () => {
  const { user } = useContext(AuthContext);
  const [pdf, setPdf] = useState(null);
  const [review, setReview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
  if (review) {
    gsap.from(".review-card", { opacity: 0, y: 20, duration: 0.6 });
  }
}, [review]);

  
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
      if (!pdf) {
        toast.error("Please upload your resume first!");
        return;
      }

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

      console.log("📦 Backend response:", res.data);

      
      if (res.data && res.data.data) {
        setReview(res.data.data);
        toast.success("AI review generated successfully!");
      } else {
        toast.error("AI review failed: No review data returned.");
      }

      setAnalyzing(false);
    } catch (err) {
      console.error("❌ Error during review:", err);
      toast.error("Something went wrong while reviewing your resume.");
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#0A0F1C] min-h-screen flex flex-col items-center justify-center text-white px-4 py-8">
      <div className="w-full max-w-2xl bg-zinc-900/70 rounded-3xl shadow-2xl backdrop-blur-md border border-zinc-800 p-8">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          AI Resume Reviewer
        </h1>

        <div className="flex flex-col items-center gap-4">
          <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-cyan-500 transition">
            <Upload size={40} className="text-cyan-400 mb-2" />
            <span className="text-gray-300">
              {pdf ? pdf.name : "Upload your resume (PDF only)"}
            </span>
            <input type="file" accept=".pdf" onChange={handleFileChange} hidden />
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

        {/* ✅ AI Review Section */}
        {review && (
          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg mt-8 review-card">
            <h2 className="text-2xl font-semibold mb-3">AI Resume Review</h2>

            <div className="mb-3">
              <p className="text-lg">
                <strong>Score:</strong> {review.score || "N/A"} / 100
              </p>
            </div>

            {review.strengths && (
              <div className="mt-3">
                <h3 className="text-xl font-medium mb-1 text-green-400">
                  Strengths:
                </h3>
                <ul className="list-disc list-inside text-green-300">
                  {review.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {review.suggestions && (
              <div className="mt-3">
                <h3 className="text-xl font-medium mb-1 text-yellow-400">
                  Suggestions:
                </h3>
                <ul className="list-disc list-inside text-yellow-300">
                  {review.suggestions.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}

            {review.atsFlags && (
              <div className="mt-3">
                <h3 className="text-xl font-medium mb-1 text-red-400">
                  ATS Flags:
                </h3>
                <ul className="list-disc list-inside text-red-300">
                  {review.atsFlags.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <CheckCircle className="text-cyan-400" size={28} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeReviewer;
