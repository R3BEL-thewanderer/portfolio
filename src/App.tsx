import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, FileText, Globe, Sparkles } from "lucide-react";
import Hls from "hls.js";
import emailjs from "@emailjs/browser";

// Lazy load Three.js galaxy to reduce initial bundle & unblock main thread
const GalaxyCanvas = lazy(() => import("./components/GalaxyCanvas"));
import LoadingScreen from "./components/LoadingScreen";
// Chatbot import omitted from build — not yet pushed to repo

const fadeUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

/* Old CSS StarField removed — replaced by Three.js GalaxyCanvas */

/* ============================
   ROTATING ORBITS
   ============================ */

const RotatingOrbits = () => (
  <div className="orbit-container my-16">
    <div className="orbit-ring">
      <div className="orbit-dot" />
    </div>
    <div className="orbit-ring orbit-ring-2">
      <div className="orbit-dot orbit-dot-2" />
    </div>
    <div className="orbit-ring orbit-ring-3">
      <div className="orbit-dot orbit-dot-3" />
    </div>
  </div>
);

/* ============================
   NAVBAR
   ============================ */

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="opacity-90">
      {/* Outer orbit ring */}
      <ellipse cx="14" cy="14" rx="12" ry="5" stroke="currentColor" strokeWidth="1" opacity="0.5" transform="rotate(-30 14 14)" />
      {/* Inner orbit ring */}
      <ellipse cx="14" cy="14" rx="10" ry="4" stroke="currentColor" strokeWidth="0.8" opacity="0.35" transform="rotate(25 14 14)" />
      {/* Center star */}
      <circle cx="14" cy="14" r="2.5" fill="currentColor" opacity="0.9" />
      {/* Orbiting dot */}
      <circle cx="25" cy="11" r="1.5" fill="#c8b1ff" opacity="0.8" />
    </svg>
    <span className="font-display font-bold text-lg tracking-tight">Ashish Singh</span>
  </div>
);

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 md:px-28 md:py-4 bg-transparent">
    <div className="flex items-center gap-12 shrink-0">
      <Logo />
      <div className="hidden md:flex items-center gap-4 text-sm font-heading font-medium text-muted-foreground">
        {["Home", "Projects", "Skills", "About", "Experience", "Contact"].map((item, i, arr) => (
          <React.Fragment key={item}>
            <a href={`#${item.toLowerCase()}`} className="hover:text-foreground transition-colors tracking-wide">
              {item}
            </a>
            {i < arr.length - 1 && <span className="opacity-40">•</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-2 md:gap-3 shrink-0">
      <a href="/Ashish_Singh_Resume.html" target="_blank" rel="noreferrer" className="liquid-glass px-3 h-7 md:px-4 md:h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform gap-2 font-heading font-semibold text-xs tracking-wide">
        <FileText size={16} className="md:w-4 md:h-4" />
        <span className="hidden md:inline">Resume</span>
      </a>
      <a href="https://github.com/R3BEL-thewanderer" target="_blank" rel="noreferrer" className="liquid-glass w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform">
        <Github size={16} className="md:w-4 md:h-4" />
      </a>
      <a href="https://linkedin.com/in/ashish-singh-209291369" target="_blank" rel="noreferrer" className="liquid-glass w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform">
        <Linkedin size={16} className="md:w-4 md:h-4" />
      </a>
      <a href="mailto:ashishhsingh4444@gmail.com" className="liquid-glass w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform">
        <Mail size={16} className="md:w-4 md:h-4" />
      </a>
    </div>
  </nav>
);

/* ============================
   HERO SECTION
   ============================ */

const HeroSection = () => (
  <section id="home" className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
    {/* Video Background — pushed behind everything with -z-10 */}
    <video
      className="absolute inset-0 w-full h-full object-cover -z-10"
      autoPlay
      loop
      muted
      playsInline
      style={{ mixBlendMode: "screen", opacity: 0.65 }}
    >
      <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4" type="video/mp4" />
    </video>

    {/* Dark overlay for text readability */}
    <div className="absolute inset-0 bg-black/30 -z-10" />

    {/* Bottom fade to background */}
    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />

    {/* Content — relative z-10, pt-24 clears the fixed navbar */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-24 pb-12 text-center max-w-4xl mx-auto">
      <motion.div {...fadeUp(0)} className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 flex-wrap justify-center">
        <div className="flex items-center gap-1.5 text-sky-400">
          <Globe className="w-4 h-4" />
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="text-muted-foreground text-xs md:text-sm font-heading font-medium tracking-wide">Available for work & collaborations</span>
        </div>
      </motion.div>

      <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight md:tracking-[-3px] mb-4 md:mb-6">
        Building <span className="font-serif italic font-normal pr-1 md:pr-2">Scalable</span> Systems
      </motion.h1>

      <motion.p {...fadeUp(0.2)} className="text-base sm:text-lg md:text-xl font-heading font-light max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-1 sm:px-0" style={{ color: "hsl(var(--hero-subtitle))" }}>
        B.E in Information Technology student at TCET, Mumbai — crafting intelligent web apps, AI-powered tools, and solutions that actually matter.
      </motion.p>

      <motion.form
        {...fadeUp(0.3)}
        className="liquid-glass rounded-2xl md:rounded-full p-2 w-full max-w-lg flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0"
        onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:ashishhsingh4444@gmail.com'; }}
      >
        <input
          type="email"
          placeholder="Enter your email to connect"
          className="flex-1 bg-transparent border-none outline-none px-4 md:px-6 py-3 md:py-0 text-foreground placeholder:text-muted-foreground font-medium text-sm sm:text-base"
          required
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-foreground text-background rounded-xl md:rounded-full px-6 md:px-8 py-3 font-heading font-bold text-xs md:text-sm tracking-[0.1em] uppercase whitespace-nowrap"
          type="submit"
        >
          LET'S TALK
        </motion.button>
      </motion.form>

      <motion.div {...fadeUp(0.4)} className="mt-8">
        <a href="/Ashish_Singh_Resume.html" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-foreground hover:bg-white/10 transition-colors font-heading font-semibold tracking-wide text-sm">
          <FileText size={18} />
          View My Resume
        </a>
      </motion.div>
    </div>
  </section>
);

/* ============================
   PROJECTS SECTION (Pinned Horizontal Scroll)
   ============================ */

const projects = [
  {
    id: "01",
    name: "Edu-Hub — TCET Notes Hub",
    category: "Full Stack · Platform",
    status: "Live Production",
    year: "2026",
    desc: "A comprehensive academic platform featuring secure RLS access, inline PDF viewing, Razorpay premium unlocks, and a context-aware Gemini AI chatbot. Built specifically for engineering students.",
    tags: ["Next.js 15", "FastAPI", "PostgreSQL", "Razorpay", "Gemini AI", "Supabase"],
    github: "https://github.com/R3BEL-thewanderer/fe-notes",
    demo: "https://edu-hub.co.in",
    image: "/img/edu-hub-logo.png",
    imageFit: "contain" as const,
    imageBg: "rgba(255,255,255,1)",
  },
  {
    id: "02",
    name: "Gradia — AI Grading System",
    category: "AI · EdTech",
    status: "Active Beta",
    year: "2025",
    desc: "A full-stack AI-powered grading platform that evaluates student answers using LLMs. Teachers upload question papers and rubrics; the system auto-grades responses with detailed feedback, reducing manual grading effort by 80%.",
    tags: ["React 19", "Python", "FastAPI", "LLM Evaluation", "Tailwind CSS"],
    github: "https://github.com/R3BEL-thewanderer/Gradia-Ai",
    demo: null,
    image: "/img/Gradia Logo(Light Mode-Primary).png",
    imageFit: "contain" as const,
    imageBg: "rgba(255,255,255,0.95)",
  },
  {
    id: "03",
    name: "Ekram Original",
    category: "E-commerce · Full Stack",
    status: "Live Production",
    year: "2024",
    desc: "A premium e-commerce platform featuring a custom shopping cart, seamless checkout flow, and intelligent inventory management. Built with Next.js, Node.js, and PostgreSQL.",
    tags: ["Next.js", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
    github: "https://github.com/R3BEL-thewanderer/ekram-original-clone",
    demo: "https://ekram-original-clone.ashish-singh.xyz",
    image: "/img/ekram-original.png",
    imageFit: "cover" as const,
    imageBg: undefined,
  },
  {
    id: "04",
    name: "MobilePhoneComparisons",
    category: "Web App · Data",
    status: "Live Deployment",
    year: "2024",
    desc: "A smart mobile phone comparison tool with real-time specs fetching, side-by-side feature comparison, and AI-generated buy recommendations.",
    tags: ["React", "Node.js", "REST APIs", "Tailwind CSS"],
    github: "https://github.com/R3BEL-thewanderer/mobilephonecomparisions",
    demo: "https://mobilephonecomparisions.ashish-singh.xyz",
    image: "/img/mobilephonecomparisions1.png",
    imageFit: "cover" as const,
    imageBg: undefined,
  },
  {
    id: "05",
    name: "AI Agent Workflows",
    category: "AI · Automation",
    status: "Automation Pipeline",
    year: "2025",
    desc: "A collection of multi-step AI agent pipelines built with LangChain & n8n — including a resume screener, social media content agent, and automated research assistant.",
    tags: ["LangChain", "n8n", "OpenAI", "Python", "Docker"],
    github: null,
    demo: null,
    image: "/img/n8n1.png",
    imageFit: "cover" as const,
    imageBg: undefined,
  },
];

const ProjectCard = ({ project, index, total, scrollYProgress }: { project: any, index: number, total: number, scrollYProgress: any }) => {
  const centerProgress = index / (total - 1);
  const step = 1 / (total - 1);

  // Map progress to arc path
  const x = useTransform(scrollYProgress, [centerProgress - step, centerProgress, centerProgress + step], ["100vw", "0vw", "-100vw"]);
  const y = useTransform(scrollYProgress, [centerProgress - step, centerProgress, centerProgress + step], ["-25vh", "0vh", "-25vh"]);
  const scale = useTransform(scrollYProgress, [centerProgress - step, centerProgress, centerProgress + step], [0.85, 1, 0.85]);
  const opacity = useTransform(
    scrollYProgress,
    [centerProgress - step, centerProgress - step/3, centerProgress + step/3, centerProgress + step],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ x, y, scale, opacity }}
      className="absolute w-[90vw] md:w-[80vw] lg:w-[70vw] max-w-5xl h-[60vh] flex flex-col lg:flex-row gap-8 md:gap-12 justify-center lg:justify-between items-center"
    >
      {/* Left Side: Thumbnail / Visual */}
      <div 
        className="w-full lg:w-1/2 h-44 md:h-64 lg:h-full rounded-2xl overflow-hidden relative flex items-center justify-center flex-shrink-0 group"
        style={{ background: project.imageBg || "rgba(255, 255, 255, 0.03)" }}
      >
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          style={{ objectFit: project.imageFit }}
        />
        {/* Floating Number Badge */}
        <span className="absolute top-4 left-4 text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90">
          {project.id} / 05
        </span>
      </div>

      {/* Right Side: Details & Actions */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center h-full z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] font-heading font-semibold tracking-[3px] uppercase text-sky-400">
            {project.category}
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-heading font-medium text-emerald-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {project.status}
          </span>
        </div>

        <h3 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4 tracking-tight text-white group-hover:text-white/90 transition-colors">
          {project.name}
        </h3>

        <p className="text-sm md:text-base text-white/50 leading-relaxed font-light mb-8 max-w-lg">
          {project.desc}
        </p>

        {/* Tech Stack Pills - Minimalist text only */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8">
          {project.tags.map((tag: string) => (
            <span key={tag} className="text-[11px] uppercase tracking-wider text-white/40 font-heading">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions - Minimalist text links */}
        <div className="flex items-center gap-8 pt-6 border-t border-white/5">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-heading font-medium tracking-widest text-white hover:text-white/60 transition-colors border-b border-transparent hover:border-white/30 pb-0.5"
            >
              <Globe className="w-3.5 h-3.5" />
              LIVE DEMO
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-heading font-medium tracking-widest text-white/50 hover:text-white transition-colors border-b border-transparent hover:border-white/30 pb-0.5"
            >
              <Github className="w-3.5 h-3.5" />
              SOURCE CODE
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={targetRef} id="projects" className="relative h-[300vh] z-10 w-full overflow-clip">
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col justify-center overflow-hidden">
        {/* Section Header */}
        <div className="absolute top-16 md:top-24 left-0 right-0 px-6 md:px-12 container mx-auto text-center z-20">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 text-xs tracking-[4px] uppercase font-heading font-semibold mb-2 text-white/50">
            <Sparkles className="w-3.5 h-3.5" />
            FEATURED PORTFOLIO
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl lg:text-7xl tracking-[-2px] font-display font-bold">
            Selected <span className="font-serif italic font-normal text-white/80">Work.</span>
          </motion.h2>
        </div>

        {/* Absolute Centered Track Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
          <div className="relative w-full h-full flex items-center justify-center pointer-events-auto mt-48 md:mt-56 lg:mt-64">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                total={projects.length} 
                scrollYProgress={scrollYProgress} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const skills = [
  { name: "Frontend", tags: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "Radix UI", "shadcn/ui", "HTML", "CSS"] },
  { name: "Backend", tags: ["Node.js", "Express.js", "FastAPI", "Python", "REST APIs", "JWT", "Zod"] },
  { name: "Database", tags: ["MongoDB", "Mongoose", "PostgreSQL", "Supabase", "Firebase", "Redis"] },
  { name: "AI & Automation", tags: ["Vertex AI", "Gemini", "OpenAI API", "LangChain", "n8n", "AI Agents", "RAG"] },
  { name: "Cloud & DevOps", tags: ["GCP", "Cloud Run", "Cloud Build", "Docker", "Vercel", "Render", "Git", "GitHub Actions"] },
  { name: "UI & Tools", tags: ["Figma", "Vite", "Recharts", "React Query", "SWR", "Zustand", "Razorpay", "Postman", "Cursor"] },
];

const HighlightTag = ({ tag, scrollYProgress, tagStart, tagEnd }: { tag: string, scrollYProgress: any, tagStart: number, tagEnd: number }) => {
  const opacity = useTransform(scrollYProgress, [tagStart, tagEnd], [0.2, 1]);
  const scale = useTransform(scrollYProgress, [tagStart, tagEnd], [1, 1.05]);
  const color = useTransform(scrollYProgress, [tagStart, tagEnd], ["rgba(255,255,255,0.2)", "rgba(255,255,255,1)"]);
  const textShadow = useTransform(
    scrollYProgress, 
    [tagStart, tagEnd], 
    ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 24px rgba(255,255,255,0.8)"]
  );

  return (
    <motion.span 
      style={{ opacity, scale, color, textShadow }}
      className="text-xl md:text-3xl lg:text-4xl font-display font-light whitespace-nowrap"
    >
      {tag}
    </motion.span>
  );
};

const CategorySegment = ({ skill, index, total, scrollYProgress }: { skill: any, index: number, total: number, scrollYProgress: any }) => {
  const windowStart = index / total;
  const windowEnd = (index + 1) / total;
  const windowLength = windowEnd - windowStart;

  // Category Fade logic
  const fadeStart = windowStart;
  const fadeInEnd = windowStart + windowLength * 0.1;
  const fadeOutStart = windowEnd - windowLength * 0.1;
  const fadeEnd = windowEnd;

  const opacity = useTransform(
    scrollYProgress,
    [fadeStart, fadeInEnd, fadeOutStart, fadeEnd],
    [0, 1, 1, 0]
  );
  
  const y = useTransform(
    scrollYProgress,
    [fadeStart, fadeInEnd, fadeOutStart, fadeEnd],
    ["30px", "0px", "0px", "-30px"]
  );

  // Tag Highlight logic
  const highlightStart = windowStart + windowLength * 0.15;
  const highlightEnd = windowEnd - windowLength * 0.15;
  const highlightLength = highlightEnd - highlightStart;

  return (
    <motion.div 
      style={{ opacity, y }} 
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
    >
      <h3 className="text-5xl md:text-6xl lg:text-8xl font-display font-medium tracking-tight text-white mb-10 md:mb-16">
        {skill.name}
      </h3>
      
      <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-12 gap-y-6 max-w-5xl items-center pb-20">
        {skill.tags.map((tag: string, j: number) => {
          const K = skill.tags.length;
          const tagStart = highlightStart + (j / K) * highlightLength;
          // Extend end range so they stay illuminated
          const tagEnd = highlightStart + ((j + 1) / K) * highlightLength;

          return (
            <HighlightTag 
              key={tag} 
              tag={tag} 
              scrollYProgress={scrollYProgress} 
              tagStart={tagStart} 
              tagEnd={tagEnd} 
            />
          );
        })}
      </div>
    </motion.div>
  );
};

const TechStackSection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={targetRef} id="skills" className="relative h-[600vh] z-10 w-full mb-32 overflow-clip">
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col justify-center overflow-hidden">
        {skills.map((skill, index) => (
          <CategorySegment 
            key={skill.name} 
            skill={skill} 
            index={index} 
            total={skills.length} 
            scrollYProgress={scrollYProgress} 
          />
        ))}
      </div>
    </section>
  );
};

/* ============================
   ABOUT / MISSION SECTION
   ============================ */

const WordReveal = ({ children, progress, range }: { children: React.ReactNode; progress: MotionValue<number>; range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }} className="mr-2 inline-block lg:mr-3">{children}</motion.span>;
};

const MissionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 50%"]
  });

  const p1 = "I'm Ashish Singh, a B.E in Information Technology student at Thakur College of Engineering & Technology, Mumbai. I build full-stack web applications, AI agents, and automation tools that solve real problems.";
  const p1Words = p1.split(" ");
  
  const p2 = "From serving as a creative working committee member at ISTE-TCET to building AI-powered grading systems, I combine technical depth with a product mindset. I'm passionate about cloud infrastructure, intelligent automation, and shipping things that work.";
  const p2Words = p2.split(" ");

  return (
    <section id="about" className="pt-0 pb-32 md:pb-44 relative z-10" ref={containerRef}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-24 px-4 max-w-5xl mx-auto">
        {/* Profile Photo */}
        <motion.div {...fadeUp(0)} className="w-40 h-40 md:w-52 md:h-52 flex-shrink-0 rounded-full overflow-hidden glass-card p-1">
          <img
            src="/img/ashish_singh.png"
            alt="Ashish Singh"
            loading="lazy"
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
        {/* About Video */}
        <motion.div {...fadeUp(0.1)} className="w-full max-w-[700px] aspect-video rounded-3xl overflow-hidden">
          <video
            loop muted playsInline
            className="w-full h-full object-cover"
            preload="none"
            poster=""
            onMouseEnter={(e) => e.currentTarget.play()}
            ref={(el) => { if (el) { const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.src = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4'; el.play().catch(()=>{}); obs.disconnect(); } }, { rootMargin: '200px' }); obs.observe(el); } }}
          />
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-tight flex flex-wrap justify-center text-[hsl(var(--hero-subtitle))]">
          {p1Words.map((word, i) => {
            const wordRaw = word.replace(/[—,.'&]/g, '');
            const isHighlight = ["ashish", "singh", "technology", "full-stack", "ai", "agents"].includes(wordRaw.toLowerCase());
            const start = i / (p1Words.length + p2Words.length);
            const end = start + 0.05;
            return (
              <WordReveal key={i} progress={scrollYProgress} range={[start, end]}>
                <span className={isHighlight ? "text-foreground" : ""}>{word}</span>
              </WordReveal>
            );
          })}
        </div>
        
        <div className="text-xl md:text-2xl lg:text-3xl font-medium mt-10 flex flex-wrap justify-center text-[hsl(var(--hero-subtitle))]">
          {p2Words.map((word, i) => {
            const start = (p1Words.length + i) / (p1Words.length + p2Words.length);
            const end = start + 0.05;
            return (
              <WordReveal key={i} progress={scrollYProgress} range={[start, end]}>
                <span>{word}</span>
              </WordReveal>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <motion.div {...fadeUp(0.3)} className="flex justify-center gap-12 md:gap-20 mt-20 px-4 flex-wrap">
        {[
          { num: "4+", label: "Projects Created" },
          { num: "GCP", label: "Cloud Certified" },
          { num: "AI", label: "Agent Builder" },
          { num: "TCET", label: "Mumbai, MH" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <span className="font-serif text-3xl md:text-4xl" style={{ color: "rgba(180,200,255,0.8)" }}>{stat.num}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

/* ============================
   EXPERIENCE SECTION
   ============================ */

const SolutionSection = () => {
  const timeline = [
    { period: "Nov 2025 — Present", role: "ISTE Creative Member", org: "ISTE Student Chapter · TCET, Mumbai", desc: "Designing event grids and promotional creatives for major college events like TCET Fiesta and AC STEM using Photoshop and Canva. Contributing to the visual identity and branding of technical and cultural programs." },
    { period: "2025 — 2029", role: "B.E. Information Technology", org: "TCET · Mumbai", desc: "Currently pursuing Bachelor of Engineering in Information Technology. Key coursework: Data Structures, OS, DBMS, Cloud Computing, Machine Learning." },
    { period: "2023 — 2024", role: "School Vice Cadet Captain", org: "Sainik School · Loni, Maharashtra", desc: "Led a house of 460+ students, developing early leadership, discipline, and communication skills in a residential military school environment." },
    { period: "Ongoing", role: "Creative Problem Solving", org: "Hackathons & Buildathons", desc: "Adept at resolving constraints efficiently, highlighted by active participation in time-critical AI Buildathons and Hackathons." },
  ];

  return (
    <section id="experience" className="py-32 md:py-44 border-t border-border/30 px-6 container mx-auto relative z-10">
      <motion.p {...fadeUp(0)} className="text-xs tracking-[4px] uppercase font-heading font-semibold mb-6 gradient-label">
        EXPERIENCE & LEADERSHIP
      </motion.p>
      
      <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-display font-bold tracking-[-2px] mb-16 max-w-3xl">
        A foundation of <span className="font-serif italic font-normal">impactful</span> collaboration
      </motion.h2>

      <motion.div {...fadeUp(0.2)} className="w-full aspect-[3/1] rounded-2xl overflow-hidden mb-20">
        <video
          loop muted playsInline
          className="w-full h-full object-cover"
          preload="none"
          ref={(el) => { if (el) { const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.src = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4'; el.play().catch(()=>{}); obs.disconnect(); } }, { rootMargin: '200px' }); obs.observe(el); } }}
        />
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6">
        {timeline.map((t, i) => (
          <motion.div key={i} {...fadeUp(0.3 + i * 0.1)} className="glass-card rounded-xl p-6">
            <span className="text-[11px] tracking-[3px] uppercase block mb-3 font-heading font-semibold gradient-label">{t.period}</span>
            <h3 className="font-display font-bold text-lg mb-1 tracking-tight">{t.role}</h3>
            <p className="text-xs font-heading text-muted-foreground mb-3 tracking-wide">{t.org}</p>
            <p className="text-sm text-muted-foreground leading-relaxed font-light">{t.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* ============================
   CTA / CONTACT SECTION
   ============================ */

const CTASection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";
  const [btnText, setBtnText] = useState("Send Message");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ maxMaxBufferLength: 10 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(()=>console.log("Auto-play prevented"));
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(()=>console.log("Auto-play prevented"));
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setBtnText("Sending...");
    
    // IMPORTANT: Replace these with your actual EmailJS credentials
    // You cannot pass your destination email here directly. You must configure
    // ashishhsingh4444@gmail.com as the destination in the EmailJS dashboard.
    const serviceId = "YOUR_SERVICE_ID";
    const templateId = "YOUR_TEMPLATE_ID";
    const publicKey = "YOUR_PUBLIC_KEY";

    emailjs.sendForm(serviceId, templateId, form, publicKey)
      .then(() => {
          setBtnText("Sent Successfully!");
          form.reset();
          setTimeout(() => setBtnText("Send Message"), 4000);
      }, (error) => {
          console.error(error.text);
          setBtnText("Error Sending");
          setTimeout(() => setBtnText("Send Message"), 4000);
      });
  };

  return (
    <section id="contact" className="relative py-32 md:py-44 border-t border-border/30 overflow-hidden flex flex-col items-center justify-center min-h-[600px]">
      <video
        ref={videoRef}
        muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-background/45 z-[1]" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-xl">
        <motion.div {...fadeUp(0)}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-foreground/80 mb-8 mx-auto">
            <div className="w-5 h-5 rounded-full border border-foreground/80" />
          </div>
        </motion.div>
        
        <motion.h2 {...fadeUp(0.1)} className="text-3xl md:text-5xl lg:text-7xl font-serif italic mb-4 md:mb-6">
          Let’s Build Together
        </motion.h2>

        <motion.p {...fadeUp(0.2)} className="text-muted-foreground text-lg font-heading font-light mb-10 max-w-md leading-relaxed">
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I’ll try my best to get back to you!
        </motion.p>

        <motion.form {...fadeUp(0.3)} className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Your Email address" className="form-input" required autoComplete="email" />
          <input name="mobile" type="tel" placeholder="Mobile Number (Optional)" className="form-input" autoComplete="tel" />
          <textarea name="message" placeholder="How can I help you?" className="form-input" rows={4} style={{ resize: "none" }} required />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-foreground text-background font-heading font-bold rounded-xl px-8 py-3.5 text-sm tracking-[0.08em] uppercase mt-2 transition-transform"
          >
            {btnText}
          </motion.button>
        </motion.form>

      </div>
    </section>
  );
};

/* ============================
   FOOTER
   ============================ */

const Footer = () => (
  <footer className="py-12 px-8 md:px-28 flex flex-col md:flex-row items-center justify-between border-t border-border/20 relative z-10">
    <p className="text-muted-foreground text-sm font-heading mb-4 md:mb-0">© 2026 Ashish Singh. All rights reserved.</p>
    <div className="flex items-center gap-6 text-sm font-heading text-muted-foreground">
      <a href="https://github.com/R3BEL-thewanderer" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors tracking-wide">GitHub</a>
      <a href="https://linkedin.com/in/ashish-singh-209291369" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors tracking-wide">LinkedIn</a>
    </div>
  </footer>
);

/* ============================
   APP
   ============================ */

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div 
        className="min-h-screen font-sans w-full"
        style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.5s ease-out" }}
      >
        {/* 3D Galaxy Canvas — lazy loaded to unblock main thread */}
        <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 0 }} />}>
          <GalaxyCanvas />
        </Suspense>
        <Navbar />
        <main className="relative z-10">
          <HeroSection />
          <ProjectsSection />
          <TechStackSection />
          <MissionSection />
          <SolutionSection />
          <div className="relative z-10 border-t border-border/20">
            <motion.div {...fadeUp(0)} className="text-center pt-20 pb-4">
              <p className="text-xs tracking-[3px] uppercase text-muted-foreground/40 mb-4">ORBITING THE COSMOS</p>
            </motion.div>
            <RotatingOrbits />
          </div>
          <CTASection />
        </main>
        <Footer />
        {/* <Chatbot /> — not yet pushed to repo */}
      </div>
    </>
  );
}
