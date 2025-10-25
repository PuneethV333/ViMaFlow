import React, { useContext, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axios from "axios";
import { AuthContext } from "../Context/AuthProvider";

const viMaCompassQuestions = [
  {
    id: "q1",
    question: "What kind of problems excite you most?",
    options: [
      "Designing beautiful user interfaces",
      "Building scalable backend systems",
      "Training intelligent models",
      "Automating infrastructure and deployments",
    ],
  },
  {
    id: "q2",
    question: "Which environment do you prefer working in?",
    options: [
      "Browser and design tools",
      "Terminal and APIs",
      "Jupyter notebooks and datasets",
      "Cloud dashboards and YAML files",
    ],
  },
  {
    id: "q3",
    question: "What’s your favorite kind of project?",
    options: [
      "Interactive websites or mobile apps",
      "REST APIs or database-driven apps",
      "Predictive analytics or recommendation engines",
      "CI/CD pipelines or container orchestration",
    ],
  },
  {
    id: "q4",
    question: "Which skill do you enjoy using most?",
    options: [
      "HTML/CSS/JavaScript",
      "Node.js/Express/MongoDB",
      "Python/TensorFlow/Pandas",
      "Docker/Kubernetes/AWS",
    ],
  },
  {
    id: "q5",
    question: "What’s your preferred work style?",
    options: [
      "Creative and collaborative",
      "Logical and structured",
      "Experimental and data-driven",
      "Systematic and automation-focused",
    ],
  },
  {
    id: "q6",
    question: "What’s your long-term goal?",
    options: [
      "Build stunning user experiences",
      "Architect robust backend systems",
      "Solve real-world problems with data",
      "Optimize infrastructure at scale",
    ],
  },
];

const QuestionSlide = ({ question, selected, onAnswer }) => {
  const swiper = useSwiper();

  const handleSelect = (option) => {
    onAnswer(question.id, option);
    setTimeout(() => {
      if (swiper.activeIndex < viMaCompassQuestions.length - 1) {
        swiper.slideNext();
      }
    }, 300);
  };

  return (
    <div className="p-6 sm:p-10">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        {question.question}
      </h2>
      <ul className="space-y-3 sm:space-y-4">
        {question.options.map((option, idx) => (
          <li key={idx}>
            <button
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg transition-all duration-300 transform ${
                selected === option
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-[1.02]"
                  : "bg-zinc-800/80 hover:bg-zinc-700 hover:scale-[1.02]"
              }`}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ViMaCompass = () => {
  const { userData } = useContext(AuthContext);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [aiGeneratedPath, setAiGeneratedPath] = useState(userData?.aiGeneratedPath || null);
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(!userData?.aiGeneratedPath);

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < viMaCompassQuestions.length) {
      alert("Please answer all questions before submitting!");
      return;
    }

    setLoading(true);
    setCompleted(false);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update/aiGeneratedPath`,
        { userid: userData._id, answers },
        { timeout: 65000 }
      );

      const generatedPath = res.data.path || res.data.user?.aiGeneratedPath;
      if (!generatedPath) throw new Error("No path returned from server");

      setAiGeneratedPath(generatedPath);
      setShowQuiz(false);
    } catch (err) {
      console.error("AI Path generation error:", err);

      const errorMessage =
        err.code === "ECONNABORTED"
          ? "Request timeout. The AI model may be loading. Please try again in 30 seconds."
          : err.response?.data?.message || "Something went wrong. Please try again.";

      setAiGeneratedPath({ raw: errorMessage });
      setShowQuiz(false);
    } finally {
      setCompleted(true);
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCompleted(false);
    setAiGeneratedPath(null);
    setShowQuiz(true);
  };


  return (
    <div className="bg-[#0A0F1C] min-h-screen flex flex-col items-center justify-center text-white px-4 py-8 sm:py-10">
      <div className="w-full max-w-2xl bg-zinc-900/70 rounded-3xl shadow-2xl backdrop-blur-md border border-zinc-800 overflow-hidden">
        <div className="text-center py-6 sm:py-8 border-b border-zinc-800">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            ViMaCompass
          </h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base">
            Discover your perfect tech path 🚀
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center p-12 sm:p-20">
            <div className="animate-spin h-12 w-12 sm:h-14 sm:w-14 border-4 border-cyan-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-cyan-400 text-base sm:text-lg">Generating your AI path...</p>
          </div>
        )}

        {!loading && !showQuiz && aiGeneratedPath ? (
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="p-6 sm:p-8 bg-zinc-800/50 rounded-2xl border border-zinc-700 shadow-md text-center space-y-4 animate-fade-in">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                {aiGeneratedPath.title}
              </h2>
              <p className="text-zinc-300">{aiGeneratedPath.description}</p>
              {aiGeneratedPath.skills?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {aiGeneratedPath.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 sm:px-3 py-1 rounded-full bg-cyan-600 text-white text-xs sm:text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-zinc-400 mt-3">Your ideal tech path ✨</p>

              <button
                onClick={handleRetake}
                className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-semibold text-white shadow-md transition-all"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        ) : (
          !loading && (
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              className="p-4 sm:p-6 md:p-10"
            >
              {viMaCompassQuestions.map((q, i) => (
                <SwiperSlide key={q.id}>
                  <QuestionSlide
                    question={q}
                    selected={answers[q.id]}
                    onAnswer={handleAnswer}
                  />
                  {i === viMaCompassQuestions.length - 1 && (
                    <div className="text-center mt-4 sm:mt-6">
                      <button
                        onClick={handleSubmit}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-xl font-semibold text-white transition-all duration-300 shadow-md hover:scale-105"
                      >
                        Get My Result
                      </button>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          )
        )}
      </div>
    </div>
  );
};

export default ViMaCompass;
