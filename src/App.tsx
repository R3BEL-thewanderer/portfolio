import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Hls from "hls.js";
import GalaxyCanvas from "./components/GalaxyCanvas";

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
  <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 md:px-28 py-4 bg-transparent">
    <div className="flex items-center gap-12">
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
    <div className="flex items-center gap-3">
      <a href="https://github.com/R3BEL-thewanderer" target="_blank" rel="noreferrer" className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform">
        <Github className="w-4 h-4" />
      </a>
      <a href="https://linkedin.com/in/ashish-singh-209291369" target="_blank" rel="noreferrer" className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform">
        <Linkedin className="w-4 h-4" />
      </a>
      <a href="mailto:ashishhsingh4444@gmail.com" className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform">
        <Mail className="w-4 h-4" />
      </a>
    </div>
  </nav>
);

/* ============================
   HERO SECTION
   ============================ */

const HeroSection = () => (
  <section id="home" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
    <video
      autoPlay loop muted playsInline
      className="absolute inset-0 w-full h-full object-cover z-[1]"
      style={{ mixBlendMode: "screen", opacity: 0.65 }}
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
    />
    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent z-[2] pointer-events-none" />

    <div className="relative z-10 pt-28 md:pt-32 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
      <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🪐</span>
          <span className="text-base">🌍</span>
          <span className="text-sm">✦</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="text-muted-foreground text-sm font-heading font-medium tracking-wide">Available for work & collaborations</span>
        </div>
      </motion.div>

      <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-[-3px] mb-6">
        Building <span className="font-serif italic font-normal pr-2">Scalable</span> Systems
      </motion.h1>

      <motion.p {...fadeUp(0.2)} className="text-lg font-heading font-light max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "hsl(var(--hero-subtitle))" }}>
        B.E in Information Technology student at TCET, Mumbai — crafting intelligent web apps, AI-powered tools, and solutions that actually matter.
      </motion.p>

      <motion.form
        {...fadeUp(0.3)}
        className="liquid-glass rounded-full p-2 w-full max-w-lg flex items-center"
        onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:ashishhsingh4444@gmail.com'; }}
      >
        <input
          type="email"
          placeholder="Enter your email to connect"
          className="flex-1 bg-transparent border-none outline-none px-6 text-foreground placeholder:text-muted-foreground font-medium"
          required
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-foreground text-background rounded-full px-8 py-3 font-heading font-bold text-sm tracking-[0.1em] uppercase"
          type="submit"
        >
          LET'S TALK
        </motion.button>
      </motion.form>
    </div>
  </section>
);

/* ============================
   PROJECTS SECTION
   ============================ */

const projects = [
  {
    name: "Gradia — AI Grading System",
    category: "AI · EdTech",
    year: "2025",
    desc: "A full-stack AI-powered grading platform that evaluates student answers using LLMs. Teachers upload question papers and rubrics; the system auto-grades responses with detailed feedback, reducing manual effort by 80%.",
    github: "https://github.com/R3BEL-thewanderer/Gradia-Ai",
    demo: null,
    image: "/img/Gradia Logo(Light Mode-Primary).png",
    imageFit: "contain" as const,
    imageBg: "rgba(255,255,255,0.95)",
  },
  {
    name: "Ekram Original",
    category: "E-commerce · Full Stack",
    year: "2024",
    desc: "A premium e-commerce platform featuring a custom shopping cart, seamless checkout flow, and intelligent inventory management. Built with Next.js, Node.js, and PostgreSQL.",
    github: "https://github.com/R3BEL-thewanderer/ekram-original-clone",
    demo: "https://ekram-original-clone.ashish-singh.xyz",
    image: "/img/ekram-original.png",
    imageFit: "cover" as const,
    imageBg: undefined,
  },
  {
    name: "MobilePhoneComparisons",
    category: "Web App · Data",
    year: "2024",
    desc: "A smart mobile phone comparison tool with real-time specs fetching, side-by-side feature comparison, and AI-generated buy recommendations.",
    github: "https://github.com/R3BEL-thewanderer/mobilephonecomparisions",
    demo: "https://mobilephonecomparisions.ashish-singh.xyz",
    image: "/img/mobilephonecomparisions1.png",
    imageFit: "cover" as const,
    imageBg: undefined,
  },
  {
    name: "AI Agent Workflows",
    category: "AI · Automation",
    year: "2025",
    desc: "A collection of multi-step AI agent pipelines built with LangChain & n8n — including a resume screener, social media content agent, and automated research assistant.",
    github: null,
    demo: null,
    image: "/img/n8n1.png",
    imageFit: "cover" as const,
    imageBg: undefined,
  },
];

const ProjectCard = ({ project, delay }: { project: typeof projects[0]; delay: number }) => (
  <motion.div {...fadeUp(delay)} className="glass-card rounded-2xl overflow-hidden cursor-pointer group">
    <div
      className="h-[200px] flex items-center justify-center overflow-hidden"
      style={{ background: project.imageBg || "transparent" }}
    >
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        style={{ objectFit: project.imageFit }}
      />
    </div>
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-heading font-semibold tracking-[3px] uppercase gradient-label">{project.category}</span>
        <span className="text-xs font-heading text-muted-foreground">{project.year}</span>
      </div>
      <h3 className="font-display font-bold text-xl mb-2 tracking-tight">{project.name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-light">{project.desc}</p>
      <div className="flex gap-3">
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer" className="text-xs font-heading font-medium px-5 py-2.5 rounded-full border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30 hover:bg-white/5 transition-all tracking-wide">
            ↗ Demo
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer" className="text-xs font-heading font-medium px-5 py-2.5 rounded-full border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30 hover:bg-white/5 transition-all tracking-wide">
            ⌥ GitHub
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

const ProjectsSection = () => (
  <section id="projects" className="pt-52 md:pt-64 pb-6 md:pb-9 px-8 container mx-auto relative z-10">
    <motion.h2 {...fadeUp(0)} className="text-5xl md:text-7xl lg:text-8xl text-center tracking-[-3px] font-display font-bold mb-6">
      Selected <span className="font-serif italic font-normal">Work.</span>
    </motion.h2>
    <motion.p {...fadeUp(0.1)} className="text-muted-foreground text-lg font-heading font-light max-w-2xl mx-auto text-center mb-24 leading-relaxed">
      From AI-powered tools to full-stack platforms — real problems, real solutions.
    </motion.p>

    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
      {projects.map((project, i) => (
        <ProjectCard key={i} project={project} delay={0.2 + i * 0.1} />
      ))}
    </div>
  </section>
);

/* ============================
   TECH STACK SECTION
   ============================ */

const skills = [
  { icon: "⚛️", name: "Frontend", tags: ["HTML", "CSS", "Framer Motion"] },
  { icon: "🖥️", name: "Backend", tags: ["JavaScript", "n8n"] },
  { icon: "🗄️", name: "Database", tags: ["MongoDB", "PostgreSQL", "Firebase", "Supabase", "Redis"] },
  { icon: "🤖", name: "AI & Automation", tags: ["LangChain", "OpenAI API", "Gemini", "n8n", "AI Agents", "RAG"] },
  { icon: "☁️", name: "Cloud & DevOps", tags: ["GCP", "Docker", "Vercel", "Git"] },
  { icon: "🎨", name: "Creative & Tools", tags: ["Figma", "Vite", "VS Code", "Postman", "Notion", "Cursor"] },
];

const TechStackSection = () => (
  <section id="skills" className="py-32 md:py-44 px-6 container mx-auto relative z-10">
    <motion.p {...fadeUp(0)} className="text-xs tracking-[4px] uppercase font-heading font-semibold mb-6 text-center gradient-label">
      TECH STACK
    </motion.p>
    <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-display font-bold tracking-[-2px] mb-6 text-center">
      Tools I <span className="font-serif italic font-normal">build</span> with.
    </motion.h2>
    <motion.p {...fadeUp(0.15)} className="text-muted-foreground text-base font-heading font-light max-w-lg mx-auto text-center mb-16 leading-relaxed">
      A curated set of technologies I use to design, build, and ship production-ready applications.
    </motion.p>

    <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
      {skills.map((skill, i) => (
        <motion.div key={i} {...fadeUp(0.2 + i * 0.08)} className="glass-card rounded-2xl p-7">
          <div className="text-3xl mb-4">{skill.icon}</div>
          <h3 className="font-display font-bold text-lg mb-4 tracking-tight">{skill.name}</h3>
          <div className="flex flex-wrap gap-2.5">
            {skill.tags.map((tag) => (
              <span key={tag} className="skill-tag">{tag}</span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

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
            src="/img/ashish_singh.jpeg"
            alt="Ashish Singh"
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
        {/* About Video */}
        <motion.div {...fadeUp(0.1)} className="w-full max-w-[700px] aspect-video rounded-3xl overflow-hidden">
          <video
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
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
          autoPlay loop muted playsInline
          className="w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const mobile = (form.elements.namedItem("mobile") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    setBtnText("Sending...");
    try {
      const response = await fetch("https://n8n.r3bel.in/webhook/portfolio-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile, message }),
      });
      if (response.ok) {
        setBtnText("Sent Successfully! ✅");
        form.reset();
        setTimeout(() => setBtnText("Send Message"), 4000);
      } else throw new Error("Not OK");
    } catch {
      setBtnText("Error Sending ❌");
      setTimeout(() => setBtnText("Send Message"), 4000);
    }
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
        
        <motion.h2 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-serif italic mb-6">
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

        <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <a href="mailto:ashishhsingh4444@gmail.com" className="liquid-glass text-foreground font-heading font-bold rounded-lg px-8 py-3.5 hover:scale-105 transition-transform text-sm tracking-[0.05em] text-center">
            Email Me
          </a>
          <a href="https://linkedin.com/in/ashish-singh-209291369" target="_blank" rel="noreferrer" className="liquid-glass text-foreground font-heading font-bold rounded-lg px-8 py-3.5 hover:scale-105 transition-transform text-sm tracking-[0.05em] text-center">
            View LinkedIn
          </a>
        </motion.div>
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
  return (
    <div className="min-h-screen font-sans">
      {/* 3D Galaxy Canvas — fixed behind entire page */}
      <GalaxyCanvas />
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
    </div>
  );
}
