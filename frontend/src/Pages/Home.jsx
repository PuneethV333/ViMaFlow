import React, { useContext, useEffect, useRef } from "react";
import {
  MessageCircle,
  Briefcase,
  Users,
  FileText,
  ArrowRight,
  Zap,
  Globe,
  Star,
  User,
} from "lucide-react";
import * as THREE from "three";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

const Home = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: <MessageCircle size={32} />,
      title: "ViMa-Chat",
      description: "Real-time messaging...",
      color: "from-emerald-600 to-emerald-400",
    },
    {
      icon: <Briefcase size={32} />,
      title: "ViMa-compass",
      description: "Discover your next career...",
      color: "from-blue-600 to-blue-400",
    },
    {
      icon: <Users size={32} />,
      title: "Follow & Network",
      description: "Follow professionals...",
      color: "from-purple-600 to-purple-400",
    },
    {
      icon: <FileText size={32} />,
      title: "Posts & Projects",
      description: "Showcase your work...",
      color: "from-pink-600 to-pink-400",
    },
    {
      icon: <User size={32} />,
      title: "Premium Profile",
      description: "Stand out with...",
      color: "from-yellow-600 to-yellow-400",
    },
    {
      icon: <Zap size={32} />,
      title: "Smart Matching",
      description: "Get matched with...",
      color: "from-red-600 to-red-400",
    },
  ];

  useEffect(() => {
    const cursor = document.querySelector("#cursor");
    if (!cursor) return;

    let mouseX = 0,
      mouseY = 0,
      posX = 0,
      posY = 0;

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

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.006);

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 160);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0f172a, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const globeParticles = 4500;
    const radius = 90;
    const globeGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(globeParticles * 3);

    for (let i = 0; i < globeParticles; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = radius + Math.random() * 0.5 - 0.25;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    globeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const globeMaterial = new THREE.PointsMaterial({
      size: 0.6,
      color: 0xc0c0c0,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const globe = new THREE.Points(globeGeometry, globeMaterial);
    scene.add(globe);

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5f5f5,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
    });

    const glowShell = new THREE.Mesh(
      new THREE.SphereGeometry(radius + 5, 64, 64),
      glowMaterial
    );
    scene.add(glowShell);

    const nodes = [];
    const nodePositions = [
      { x: 35, y: 25, z: 0 },
      { x: -35, y: 25, z: 10 },
      { x: 35, y: -25, z: -10 },
      { x: -35, y: -25, z: 10 },
      { x: 0, y: 40, z: -25 },
      { x: 0, y: -40, z: 25 },
    ];

    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x10b981,
      emissiveIntensity: 0.2,
    });

    nodePositions.forEach((pos) => {
      const node = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), nodeMaterial);
      node.position.set(pos.x, pos.y, pos.z);
      scene.add(node);
      nodes.push(node);
    });

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xd9d9d9,
      transparent: true,
      opacity: 0.4,
    });

    nodePositions.forEach((pos) => {
      const pts = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(pos.x, pos.y, pos.z),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      scene.add(new THREE.Line(geo, lineMat));
    });

    const particleCount = 300;
    const particlesGeo = new THREE.BufferGeometry();
    const spacePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      spacePos[i] = (Math.random() - 0.5) * 250;
    }
    particlesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(spacePos, 3)
    );
    const particlesMat = new THREE.PointsMaterial({
      size: 1,
      color: 0xe5e5e5,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    const light1 = new THREE.DirectionalLight(0xffffff, 0.9);
    light1.position.set(50, 50, 60);
    const light2 = new THREE.PointLight(0x10b981, 0.5, 300);
    light2.position.set(-40, -40, -40);
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(light1, light2, ambient);

    let mouseX = 0,
      mouseY = 0;
    document.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let t = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      t += 0.003;

      camera.position.x = Math.sin(t * 0.5) * 40 + mouseX * 50;
      camera.position.y = Math.sin(t * 0.8) * 20 + mouseY * 50;
      camera.lookAt(0, 0, 0);

      globe.rotation.y += 0.004 + mouseX * 0.01;
      globe.rotation.x += 0.002 + mouseY * 0.01;
      glowShell.rotation.y += 0.002 + mouseX * 0.005;

      globe.material.opacity = 0.7 + Math.sin(t * 2) * 0.1;

      nodes.forEach((node, i) => {
        const scale = 1 + Math.sin(t * 2 + i) * 0.05;
        node.scale.set(scale, scale, scale);
      });

      particles.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-slate-950 text-white overflow-hidden">
      <div
        id="cursor"
        className="fixed w-6 h-6 rounded-full pointer-events-none hidden sm:block z-50 mix-blend-difference bg-white opacity-80"
      ></div>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-screen" />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center px-4"
      >
        <div className="text-center z-10 max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Vima Flow
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The ultimate job portfolio platform where talent meets opportunity.
            Connect, showcase, and grow your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2 justify-center"
              onClick={() => {
                !user ? navigate("/login") : navigate("/dashboard");
              }}
            >
              Get Started <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur border border-slate-800/50 hover:border-slate-700 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="relative z-10 py-20 px-4 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-16 text-center bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Why Choose Vima Flow?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Trusted by Thousands",
                desc: "Join a growing community of professionals",
              },
              {
                icon: Globe,
                title: "Global Network",
                desc: "Connect with opportunities worldwide",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Real-time updates and instant notifications",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Active Users" },
              { number: "10K+", label: "Job Matches" },
              { number: "500+", label: "Companies" },
              { number: "99%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="stat-number text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.number}
                </p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 rounded-3xl p-12">
          <h2 className="text-5xl font-black mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals using Vima Flow to find their dream
            jobs and build meaningful connections.
          </p>
          <button
            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
            onClick={() => {
              !user ? navigate("/login") : navigate("/dashboard");
            }}
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-12 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Vima Flow
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your gateway to career success. Connect with professionals,
              showcase your portfolio, and find your dream job all in one
              platform.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="https://x.com/"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              X
            </a>
            <span className="text-gray-700">•</span>
            <a
              href="https://www.linkedin.com/in/puneeth-v-78a394336/"
              target="_blank"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-gray-700">•</span>
            <a
              href="https://github.com/PuneethV333"
              target="_blank"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              GitHub
            </a>
            <span className="text-gray-700">•</span>
            <a
              href="https://www.instagram.com/333_appu_x/"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
              target="_blank"
            >
              Instagram
            </a>
          </div>

          <div className="border-t border-slate-800 pt-8 text-gray-500">
            <p>
              &copy; 2024 Vima Flow. Empowering careers worldwide. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
