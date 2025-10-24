import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Unleash Your Potential",
    description:
      "Break free from the ordinary. ViMaFlow helps you turn ambition into action, and passion into progress.",
  },
  {
    title: "Your Story, Amplified",
    description:
      "Craft a digital presence that speaks louder than words. Your journey deserves a spotlight — we built the stage.",
  },
  {
    title: "Momentum That Moves You",
    description:
      "No more waiting. ViMaFlow connects you with opportunities that match your energy, drive, and vision.",
  },
  {
    title: "Confidence in Every Click",
    description:
      "Navigate your path with clarity. From onboarding to growth, every interaction is designed to empower.",
  },
  {
    title: "A Tribe That Gets You",
    description:
      "Find collaborators, mentors, and allies who speak your language — and challenge you to level up.",
  },
  {
    title: "Your Future, in Focus",
    description:
      "Whether you're building a brand or chasing a dream, ViMaFlow keeps your goals sharp and your progress visible.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const container = useRef();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const cursor = document.querySelector("#cursor");
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    const updateCursor = () => {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;
      gsap.set(cursor, { x: posX, y: posY });
      requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".nav", {
        y: -50,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      })
        .from(
          ".logo",
          { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)" },
          "-=0.5"
        )
        .from("#hero h1", {
          x: -100,
          opacity: 0,
          duration: 1.3,
          ease: "power3.out",
        })
        .from("#hero p", {
          x: -100,
          opacity: 0,
          duration: 1.3,
          ease: "power3.out",
        });

      const cards = gsap.utils.toArray(".feature-card");
      gsap.set(cards, { opacity: 0, y: 60 });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".feature-section",
          start: "top 50%",
          end: "bottom 10%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".cta-section", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={container}
      className="bg-[url('https://res.cloudinary.com/deymewscv/image/upload/v1760816654/create_a_dark-themed_alysmn.png')] bg-no-repeat bg-[#0A0F1C] min-h-screen w-full text-zinc-400 flex flex-col overflow-x-hidden"
      id="main"
    >
      <div
        id="cursor"
        className="fixed w-6 h-6 rounded-full pointer-events-none hidden sm:block z-50
             mix-blend-difference bg-white opacity-80"
      ></div>

      {showTopBtn?<button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 bg-[#6EE7B7] text-[#0A0F1C] px-4 py-2 rounded-full shadow-lg hover:bg-[#4FD1C5] transition duration-300 text-sm font-medium"
        aria-label="Back to top"
      >
        ↑ Top
      </button>:""}

      <nav className="nav bg-[#121826]/80 h-[80px] w-full p-5 flex justify-between items-center sticky top-0 z-50 shadow-md backdrop-blur-md">
        <div className="logo flex items-center gap-4">
          <img
            src="https://res.cloudinary.com/deymewscv/image/upload/v1760784489/smaller_mobile_versi_y0q4zd.png"
            alt="ViMa-Flow"
            className="w-28 drop-shadow-lg hidden sm:block"
          />
          <img
            src="https://res.cloudinary.com/deymewscv/image/upload/v1760798310/make_the_background_emesg0.png"
            alt="ViMa-Flow"
            className="w-28 drop-shadow-lg block sm:hidden"
          />
        </div>
        <div className="nav-links flex gap-8 items-center text-lg font-medium">
          {["Login", "Signup", "About"].map((item) => (
            <h1
              key={item}
              className="cursor-pointer hover:text-[#6EE7B7] transition duration-300"
            >
              {item}
            </h1>
          ))}
        </div>
      </nav>

      <section className="px-6 py-12 text-left max-w-4xl" id="hero">
        <h1 className="text-4xl sm:text-7xl font-bold text-zinc-100 mb-6 leading-tight">
          Welcome to ViMaFlow
        </h1>
        <p className="text-zinc-400 text-lg sm:text-4xl leading-relaxed">
          A smart platform that blends innovation, design, and technology to
          streamline your workflow and amplify your impact.
        </p>
      </section>

      <section className="feature-section px-4 sm:px-6 lg:px-12 py-12 sm:py-20 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature, index) => {
          const isHovered = hoveredIndex === index;
          const isBlurred = hoveredIndex !== null && hoveredIndex !== index;

          return (
            <div
              key={index}
              className={`feature-card bg-[#121826]/80 p-5 sm:p-6 rounded-2xl shadow-lg border border-zinc-700
          transition-all duration-300 cursor-pointer hover:shadow-[#6EE7B7]/40
          ${isHovered ? "scale-105 -translate-y-2 z-10" : ""}
          ${isBlurred ? "blur-sm opacity-60" : ""}
        `}
              onMouseEnter={() => {
                setHoveredIndex(index);
                gsap.to("#cursor", {
                  scale: 2,
                  backgroundColor: "#6EE7B7",
                  duration: 0.3,
                });
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                gsap.to("#cursor", {
                  scale: 1,
                  backgroundColor: "#fff",
                  duration: 0.3,
                });
              }}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 tracking-wide">
                {feature.title}
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </section>

      <section className="cta-section px-4 sm:px-6 lg:px-12 py-16 sm:py-24 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6">
          Ready to elevate your journey?
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
          Join ViMaFlow and unlock a platform built for creators, dreamers, and
          doers. Your next chapter starts here.
        </p>
        <button
          className="bg-[#6EE7B7] text-[#0A0F1C] font-semibold px-6 py-3 rounded-full text-lg hover:bg-[#4FD1C5] transition duration-300 shadow-lg"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </section>


      <Footer />
    </div>
  );
};

export default Home;
