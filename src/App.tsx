import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download, FileBadge, X, ExternalLink, Cloud, Database, Code2, Cpu, GraduationCap } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-3.975-1.395-.09-.225-.48-1.395-.825-1.68-.285-.15-.69-.51-.015-.525.63-.015 1.08.585 1.23.825.72 1.215 1.875.87 2.325.66.075-.525.285-.87.51-1.065-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.3.255.57.735.57 1.485 0 1.065-.015 1.92-.015 2.19 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 448 512" fill="currentColor" className={className}>
    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

// --- REUSABLE COMPONENTS ---

const FadeIn = ({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = "" }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const LiveProjectButton = ({ url }: { url?: string }) => {
  return (
    <a href={url || "#"} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors inline-block text-center whitespace-nowrap">
      Live Demo
    </a>
  );
};

const Magnet = ({ children, padding = 150, strength = 3, activeTransition = "transform 0.3s ease-out", inactiveTransition = "transform 0.6s ease-in-out", className = "" }: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (distance < padding) {
        setIsActive(true);
        setPosition({ x: distanceX / strength, y: distanceY / strength });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, strength]);

  return (
    <div 
      ref={ref} 
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isActive ? activeTransition : inactiveTransition,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

const AnimatedText = ({ text, className = "" }: { text: string, className?: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2']
  });

  const words = text.split(' ');
  let charIndexCounter = 0;
  const totalChars = text.replace(/\s/g, '').length;

  return (
    <p ref={ref} className={className}>
      {words.map((word, wordIndex) => {
        return (
          <span key={wordIndex} className="inline-block mr-[0.25em]">
            {word.split('').map((char, charIndex) => {
              const currentIdx = charIndexCounter++;
              const start = currentIdx / totalChars;
              const end = start + (1 / totalChars);
              
              return <AnimatedChar key={charIndex} char={char} progress={scrollYProgress} start={start} end={end} />;
            })}
          </span>
        );
      })}
    </p>
  );
};

const AnimatedChar = ({ char, progress, start, end }: any) => {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="invisible">{char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">{char}</motion.span>
    </span>
  );
};

// --- MODAL ARCHITECTURE ---

const CredentialsModal = ({ activeModal, setActiveModal }: { activeModal: string | null, setActiveModal: (v: string | null) => void }) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  if (!activeModal) return null;

  const close = () => {
    setActiveModal(null);
    setSelectedPdf(null);
    setSelectedCompany(null);
  };

  const certificates = [
    { 
      company: "AWS", 
      icon: <Cloud className="w-8 h-8 text-[#BE4C00]" />,
      files: [{ name: "AWS Cloud Practitioner", url: "/certificates/aws_real.pdf" }] 
    },
    { 
      company: "MongoDB", 
      icon: <Database className="w-8 h-8 text-[#BE4C00]" />,
      files: [
        { name: "MongoDB Developer", url: "/certificates/mongodb_real.pdf" },
        { name: "M001: Basics", url: "/certificates/1.pdf" },
        { name: "M103: Cluster Admin", url: "/certificates/2.pdf" },
        { name: "M121: Aggregation", url: "/certificates/3.pdf" },
        { name: "M201: Performance", url: "/certificates/4.pdf" },
        { name: "M220JS: Node.js", url: "/certificates/5.pdf" },
        { name: "M320: Data Modeling", url: "/certificates/6.pdf" }
      ] 
    },
    { 
      company: "HackerRank", 
      icon: <Code2 className="w-8 h-8 text-[#BE4C00]" />,
      files: [
        { name: "Problem Solving", url: "/certificates/hackerrank_real.pdf" },
        { name: "Python Basic", url: "/certificates/7.pdf" }
      ] 
    },
    { 
      company: "Arduino", 
      icon: <Cpu className="w-8 h-8 text-[#BE4C00]" />,
      files: [{ name: "Arduino Fundamentals", url: "/certificates/arduino_real.pdf" }] 
    },
    { 
      company: "Internshala", 
      icon: <GraduationCap className="w-8 h-8 text-[#BE4C00]" />,
      files: [{ name: "Web Development", url: "/certificates/1.pdf" }] 
    }
  ];

  const totalCerts = certificates.reduce((sum, cert) => sum + cert.files.length, 0);

  const handleCompanyClick = (cert: any) => {
    if (cert.files.length === 1) {
      setSelectedPdf(cert.files[0].url);
    } else {
      setSelectedCompany(cert);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#111] rounded-[40px] border border-[#D7E2EA]/20 shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '90vh', minHeight: selectedPdf ? '80vh' : 'auto' }}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-[#D7E2EA]/10 shrink-0">
           <h2 className="text-[#D7E2EA] font-black text-2xl uppercase tracking-widest flex items-center gap-4">
             {selectedPdf ? (
               <button onClick={() => setSelectedPdf(null)} className="text-[#B600A8] hover:text-white text-sm tracking-wider flex items-center gap-1 border border-[#B600A8]/30 rounded-full px-4 py-1">
                 ← Back
               </button>
             ) : selectedCompany ? (
               <button onClick={() => setSelectedCompany(null)} className="text-[#BE4C00] hover:text-white text-sm tracking-wider flex items-center gap-1 border border-[#BE4C00]/30 rounded-full px-4 py-1">
                 ← Companies
               </button>
             ) : null}
             
             {selectedPdf ? "Document Viewer" : 
              selectedCompany ? `${selectedCompany.company} Certs` : 
              activeModal === 'resume' ? "Resume Options" : `My Certifications (${totalCerts} Total)`}
           </h2>
           <button onClick={close} className="p-2 bg-[#0C0C0C] rounded-full hover:bg-white/10 transition-colors">
             <X className="w-6 h-6 text-white" />
           </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 flex flex-col">
          {selectedPdf ? (
            <div className="w-full flex-1 rounded-2xl overflow-hidden bg-zinc-900 relative border border-[#D7E2EA]/10 min-h-[400px] md:min-h-[500px]">
              <iframe src={selectedPdf} className="w-full h-full border-none" title="PDF Viewer" />
              <div className="absolute top-4 right-4 flex gap-4">
                 <a href={selectedPdf} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-[#B600A8] text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#B600A8]/80 transition-colors shadow-lg flex items-center gap-2">
                   <ExternalLink size={16} /> Open in Browser
                 </a>
              </div>
            </div>
          ) : activeModal === 'resume' ? (
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl mx-auto items-stretch justify-center py-10">
              <button onClick={() => setSelectedPdf("/certificates/Sriram_Resume.pdf")} className="flex-1 bg-gradient-to-br from-[#18011F] to-[#0C0C0C] border border-[#B600A8]/30 rounded-[30px] p-10 flex flex-col items-center justify-center gap-6 hover:border-[#B600A8] hover:scale-[1.02] transition-all shadow-2xl">
                <div className="w-20 h-20 bg-[#B600A8]/20 rounded-full flex items-center justify-center"><ExternalLink className="w-10 h-10 text-[#B600A8]" /></div>
                <div className="text-center">
                  <h3 className="text-[#D7E2EA] font-black text-2xl uppercase mb-2">View Online</h3>
                  <p className="text-[#D7E2EA]/60 font-medium">Read directly in the browser</p>
                </div>
              </button>
              <a href="/certificates/Sriram_Resume.pdf" download className="flex-1 bg-[#111] border border-[#D7E2EA]/10 rounded-[30px] p-10 flex flex-col items-center justify-center gap-6 hover:border-[#D7E2EA]/30 hover:bg-[#1a1a1a] hover:scale-[1.02] transition-all shadow-2xl">
                <div className="w-20 h-20 bg-[#D7E2EA]/10 rounded-full flex items-center justify-center"><Download className="w-10 h-10 text-[#D7E2EA]" /></div>
                <div className="text-center">
                  <h3 className="text-[#D7E2EA] font-black text-2xl uppercase mb-2">Download</h3>
                  <p className="text-[#D7E2EA]/60 font-medium">Save PDF to your device</p>
                </div>
              </a>
            </div>
          ) : selectedCompany ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {selectedCompany.files.map((file: any, idx: number) => (
                <button key={idx} onClick={() => setSelectedPdf(file.url)} className="bg-gradient-to-br from-[#111] to-[#0C0C0C] border border-[#BE4C00]/30 rounded-[30px] p-8 text-left hover:border-[#BE4C00] hover:scale-[1.02] transition-all group flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#BE4C00]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileBadge className="w-8 h-8 text-[#BE4C00]" />
                  </div>
                  <h3 className="text-[#D7E2EA] font-bold text-xl mb-2">{file.name}</h3>
                  <p className="text-[#D7E2EA]/50 text-sm">Click to view PDF</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {certificates.map((cert, idx) => (
                <button key={idx} onClick={() => handleCompanyClick(cert)} className="bg-gradient-to-b from-[#111] to-[#0C0C0C] border border-[#D7E2EA]/10 rounded-[30px] p-8 text-left hover:border-[#BE4C00]/50 hover:shadow-[0_0_30px_rgba(190,76,0,0.15)] transition-all group flex flex-col h-full">
                  <div className="w-16 h-16 bg-[#BE4C00]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {cert.icon}
                  </div>
                  <h3 className="text-[#D7E2EA] font-black text-2xl uppercase mb-2">{cert.company}</h3>
                  <p className="text-[#D7E2EA]/50 font-bold tracking-widest text-xs uppercase mt-auto">{cert.files.length} Certificate{cert.files.length !== 1 && 's'}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- MAIN SECTIONS ---

const HeroSection = ({ setActiveModal }: { setActiveModal: (v: string) => void }) => {
  return (
    <section className="h-screen flex flex-col overflow-x-clip relative">
      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.7 }}
        className="flex flex-wrap justify-between gap-x-4 gap-y-2 px-5 sm:px-10 pt-6 md:pt-8 text-[#D7E2EA] font-medium uppercase tracking-wider text-[10px] sm:text-sm md:text-lg lg:text-[1.4rem] z-20"
      >
        <a href="#about" className="hover:opacity-70 transition-opacity duration-200">About</a>
        <a href="#projects" className="hover:opacity-70 transition-opacity duration-200">Projects</a>
        <a href="#achievements" className="hover:opacity-70 transition-opacity duration-200">Achievements</a>
        <a href="#contact" className="hover:opacity-70 transition-opacity duration-200">Contact</a>
      </motion.nav>

      {/* Hero Heading */}
      <div className="flex-1 flex flex-col justify-center w-full z-20 pointer-events-none">
        <div className="overflow-hidden w-full flex justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[12.5vw] sm:text-[13vw] md:text-[14vw] lg:text-[14.5vw] xl:text-[15vw] mt-6 sm:mt-4 md:-mt-5"
          >
            Hi, i&apos;m sriram
          </motion.h1>
        </div>
      </div>

      {/* Bottom Bar with Credentials Buttons */}
      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 z-20">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px] text-[clamp(0.75rem,1.4vw,1.5rem)]">
            A software engineer driven by crafting striking and unforgettable AI-integrated projects
          </p>
        </FadeIn>
        
        {/* Credentials Top Buttons */}
        <FadeIn delay={0.5} y={20} className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setActiveModal('resume')}
            className="rounded-full font-bold uppercase tracking-widest px-8 py-3.5 text-xs sm:text-sm md:text-base text-white hover:scale-105 transition-transform"
            style={{
              background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
              boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
              outline: '2px solid white',
              outlineOffset: '-3px'
            }}
          >
            Resume
          </button>
          <button 
            onClick={() => setActiveModal('certificates')}
            className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-bold uppercase tracking-widest px-8 py-3.5 text-xs sm:text-sm md:text-base hover:bg-[#D7E2EA]/10 transition-colors"
          >
            Certifications
          </button>
        </FadeIn>
      </div>

      {/* Hero Portrait - 3D Face */}
      <FadeIn delay={0.6} y={30} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]">
        <Magnet padding={150} strength={3}>
          <img src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png" alt="3D Model" className="w-full h-auto object-contain pointer-events-auto" />
        </Magnet>
      </FadeIn>
    </section>
  );
};

const TextMarqueeSection = () => {
  return (
    <div className="bg-[#B600A8]/10 border-y border-[#B600A8]/20 py-6 overflow-hidden flex whitespace-nowrap relative z-20">
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 25s linear infinite;
        }
      `}</style>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0C] via-transparent to-[#0C0C0C] z-10 w-full pointer-events-none"></div>
      
      <div className="flex animate-ticker w-max">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[#D7E2EA] font-black text-2xl sm:text-3xl tracking-widest uppercase flex gap-8 items-center shrink-0 pr-8">
            FULL STACK DEVELOPER <span className="text-[#BE4C00]">•</span> AI INTEGRATION <span className="text-[#BE4C00]">•</span> NATIONAL HACKATHON WINNER <span className="text-[#BE4C00]">•</span> UI/UX DESIGNER <span className="text-[#BE4C00]">•</span> CLOUD ARCHITECT <span className="text-[#BE4C00]">•</span> PROBLEM SOLVER <span className="text-[#BE4C00]">•</span> REACT <span className="text-[#BE4C00]">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="min-h-screen relative flex flex-col md:flex-row items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden max-w-7xl mx-auto gap-12 z-20">
      <FadeIn delay={0.2} x={-40} className="w-full md:w-5/12 flex justify-center">
        <div className="relative group p-4 border border-[#B600A8]/20 rounded-[40px] bg-[#111]">
          <img src="/images/me.jpg" className="w-[280px] md:w-[350px] h-[350px] md:h-[450px] object-cover rounded-[30px] transition-all duration-500 shadow-2xl relative z-10" alt="Sriram S" />
        </div>
      </FadeIn>

      <div className="w-full md:w-7/12 flex flex-col items-start gap-8 z-20">
        <FadeIn delay={0} y={20}>
          <p className="text-[#B600A8] uppercase tracking-widest font-bold text-sm mb-2">— WHO AM I</p>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,6vw,80px)] text-left mb-2">
            Sriram <span className="text-[#D7E2EA]">S</span>
          </h2>
          <p className="text-[#BE4C00] font-medium text-lg md:text-xl uppercase tracking-wider mb-6">Cloud & AI Integration · Mobile App Developer · 3rd Year CSE</p>
        </FadeIn>

        <div className="text-[clamp(1rem,1.5vw,1.2rem)] font-medium text-left leading-relaxed">
          <AnimatedText 
            text="Computer Science undergraduate with hands-on experience building and deploying full-stack web and mobile applications with AI-based features. Proficient in RESTful architecture and modern development tools. " 
            className="text-[#D7E2EA]/80 inline"
          />
          <span className="text-[#BE4C00] font-black inline">National hackathon winner </span>
          <AnimatedText 
            text="with strong project-based experience." 
            className="text-[#D7E2EA]/80 inline"
          />
        </div>

        {/* Stats Row */}
        <FadeIn delay={0.3} y={20} className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mt-6 w-full border-t border-[#D7E2EA]/10 pt-8">
           <div>
             <span className="text-4xl md:text-5xl font-black text-[#D7E2EA]">500<span className="text-[#B600A8]">+</span></span>
             <p className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs font-bold mt-2">Days Building</p>
           </div>
           <div>
             <span className="text-4xl md:text-5xl font-black text-[#D7E2EA]">20<span className="text-[#B600A8]">+</span></span>
             <p className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs font-bold mt-2">Projects</p>
           </div>
           <div>
             <span className="text-4xl md:text-5xl font-black text-[#D7E2EA]">30<span className="text-[#B600A8]">+</span></span>
             <p className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs font-bold mt-2">Certifications</p>
           </div>
        </FadeIn>

        <FadeIn delay={0.4} y={20} className="mt-10">
          <a 
            href="#contact"
            className="rounded-full border-2 border-[#B600A8] text-white font-bold uppercase tracking-widest px-10 py-4 text-sm hover:bg-[#B600A8] transition-all inline-block shadow-[0_0_20px_rgba(182,0,168,0.3)]"
          >
            Contact Me
          </a>
        </FadeIn>
      </div>
    </section>
  );
};

const AchievementsSection = () => {
  return (
    <section id="achievements" className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-24 relative z-20">
      <h2 className="hero-heading font-black uppercase text-center text-[clamp(2.5rem,8vw,100px)] mb-16 leading-none tracking-tight">
        Achievements
      </h2>
      
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Hackathon 1st Place */}
        <div className="flex flex-col lg:flex-row gap-12 items-center bg-[#111] rounded-[40px] p-6 sm:p-10 lg:p-12 border border-[#D7E2EA]/10 shadow-2xl">
          <div className="flex-1">
            <span className="text-[#B600A8] font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 block">— ACHIEVEMENT</span>
            <h3 className="text-[#D7E2EA] font-black text-4xl sm:text-5xl uppercase mb-3 tracking-tight">
              Hackathon <span className="text-[#BE4C00]">1st Place</span>
            </h3>
            <p className="text-[#D7E2EA]/50 text-xs sm:text-sm mb-8 uppercase tracking-widest font-medium">Rathinam College • Inter-College Hackathon • Tamil Nadu</p>
            <p className="text-[#D7E2EA]/80 font-light leading-relaxed mb-10 text-base">
              Led the development of the core application as part of a team at the Rathinam College Inter-College Hackathon. Collaborated with teammates to design, build, and pitch a fully functional product within the competition timeframe — earning 1st Place among 50+ teams and 200+ participants from colleges across Tamil Nadu.
            </p>
            <div className="flex gap-8">
               <div className="text-center">
                  <span className="block text-3xl font-black text-[#BE4C00] mb-1">50+</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60 font-bold">Teams</span>
               </div>
               <div className="text-center">
                  <span className="block text-3xl font-black text-[#B600A8] mb-1">200+</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60 font-bold">Students</span>
               </div>
               <div className="text-center">
                  <span className="block text-3xl font-black text-[#7621B0] mb-1">1st</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/60 font-bold">Prize</span>
               </div>
            </div>
          </div>
          <div className="flex-1 flex gap-4 h-[300px] sm:h-[400px]">
            <img src="/images/hack.jpeg" className="w-1/2 h-full object-cover rounded-3xl" alt="Hackathon" />
            <img src="/images/temp.jpeg" className="w-1/2 h-full object-cover rounded-3xl" alt="Brochure" />
          </div>
        </div>

        {/* Technical Recognition */}
        <div className="flex flex-col lg:flex-row-reverse gap-12 items-center bg-[#111] rounded-[40px] p-6 sm:p-10 lg:p-12 border border-[#D7E2EA]/10 shadow-2xl">
          <div className="flex-1">
            <span className="text-[#BE4C00] font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 block">— RECOGNITION</span>
            <h3 className="text-[#D7E2EA] font-black text-4xl sm:text-5xl uppercase mb-3 tracking-tight">
              Technical <span className="text-[#B600A8]">Recognition</span>
            </h3>
            <p className="text-[#D7E2EA]/50 text-xs sm:text-sm mb-8 uppercase tracking-widest font-medium">Technical Innovation & Prototyping</p>
            <p className="text-[#D7E2EA]/80 font-light leading-relaxed mb-6 text-base">
              Recognised for technical innovation and rapid prototyping; appreciated by faculty and industry judges.
            </p>
            <p className="text-[#D7E2EA]/80 font-light leading-relaxed text-base">
              • Distinguished Technical Recognition: Commended by the Head of Department and Vice President, SISA Information Security Pvt. Ltd., for technical excellence and professional conduct.
            </p>
          </div>
          <div className="flex-1 h-[300px] sm:h-[400px]">
            <img src="/images/hack-2.jpg" className="w-full h-full object-cover rounded-3xl" alt="Recognition" />
          </div>
        </div>
      </div>
    </section>
  )
}

const ProjectCard = ({ project, i, progress, range, targetScale }: any) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="h-screen w-full flex items-center justify-center sticky top-0 pointer-events-none">
      <motion.div
        style={{
          scale,
          top: `calc(15vh + ${i * 15}px)`,
        }}
        className="relative w-full h-[85vh] md:h-[70vh] rounded-[40px] border border-[#D7E2EA]/20 bg-[#0C0C0C] p-6 sm:p-10 flex flex-col md:flex-row gap-8 md:gap-10 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto"
      >
        {/* Left Side: Text Details */}
        <div className="flex-1 flex flex-col justify-center h-full z-10">
          <span className="font-black text-[#D7E2EA]/10 text-[150px] leading-none absolute top-[-20px] left-[-20px] -z-10 pointer-events-none tracking-tighter">0{i + 1}</span>
          <span className="text-[#B600A8] uppercase text-xs font-bold tracking-widest mb-4">{project.category}</span>
          <h3 className="text-[#D7E2EA] font-black uppercase text-4xl sm:text-5xl mb-6">{project.name}</h3>
          <p className="text-[#D7E2EA]/70 font-light text-base md:text-lg mb-10 leading-relaxed max-w-xl pr-4">{project.desc}</p>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 z-50">
              {project.url && <LiveProjectButton url={project.url} />}
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className="rounded-full border-2 border-[#D7E2EA]/20 text-[#D7E2EA]/80 hover:text-white font-medium uppercase tracking-widest px-6 md:px-8 py-3 md:py-3.5 hover:bg-[#D7E2EA]/10 transition-colors flex items-center gap-2 text-xs sm:text-base cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-3.975-1.395-.09-.225-.48-1.395-.825-1.68-.285-.15-.69-.51-.015-.525.63-.015 1.08.585 1.23.825.72 1.215 1.875.87 2.325.66.075-.525.285-.87.51-1.065-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.3.255.57.735.57 1.485 0 1.065-.015 1.92-.015 2.19 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" /></svg>
                  Code
                </a>
              )}
            </div>
            {!project.url && project.github && (
              <p className="text-red-500/90 text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-2 max-w-sm">* Mobile application. Visit GitHub for source.</p>
            )}
          </div>
        </div>

        {/* Right Side: Large Single Image / Video */}
        <div className="flex-1 h-[250px] md:h-full rounded-[30px] overflow-hidden bg-zinc-900 border border-[#D7E2EA]/10 relative group">
          {project.images[0].endsWith('.mp4') ? (
            <video 
              src={project.images[0]} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <img 
              src={project.images[0]} 
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
              alt={`${project.name}`} 
            />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none"></div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const projects = [
    {
      name: "Javino",
      category: "AI Media Authenticity",
      desc: "An enterprise-grade forensic platform that detects AI-generated media and deepfakes using advanced vision AI (Llama-4-Scout) and LLM-powered analysis.",
      url: "https://javino.netlify.app/",
      github: "https://github.com/SriramGandhiS/Javino-AI-Authenticity",
      images: ["/images/javino_cover.mp4"]
    },
    {
      name: "HireSense",
      category: "AI Mock Interview Platform",
      desc: "Built an end-to-end mock interview web application using React. It leverages a local LLM for real-time speech transcription and integrates the Groq API to deliver deep AI-driven insights and dynamically personalized question sets.",
      url: "https://hiresense-ai-phi.vercel.app",
      github: "https://github.com/SriramGandhiS",
      images: ["/images/hiresense_cover.mp4"]
    },
    {
      name: "CSE UTSAV 2K26",
      category: "Serverless Event Registration",
      desc: "Engineered a serverless registration portal managing 1500+ participants across 10 events with zero data loss and multi-layer form validation using JavaScript and App Script.",
      url: "https://utsav2k26.netlify.app",
      github: "https://github.com/SriramGandhiS/UTSAV2K26",
      images: ["/images/utsav_cover.mp4"]
    },
    {
      name: "SmartSlate",
      category: "Full-Stack EdTech Platform",
      desc: "Comprehensive learning management system for schools, featuring real-time attendance, results management, and circular distribution with a secure multi-role dashboard.",
      url: "https://smartslate.netlify.app",
      github: "https://github.com/SriramGandhiS",
      images: ["/images/smartslate_cover.mp4"]
    },
    {
      name: "Portfolio",
      category: "Highly Interactive Web",
      desc: "Personal portfolio website built with modern web technologies, featuring highly interactive 3D designs, GSAP animations, and premium user interfaces.",
      url: "https://sriram.website",
      github: "https://github.com/SriramGandhiS",
      images: ["/images/portfolio_cover.mp4"]
    },
    {
      name: "ROI Legal App",
      category: "AI Legal Tutor App",
      desc: "An all-in-one AI-powered legal learning platform featuring NEEDHi (AI Legal Tutor). Designed to empower citizens, this gamified app won ₹15k in a National Level Hackathon.",
      url: "",
      github: "https://github.com/SriramGandhiS/ROI-THE-LEGAL-APP",
      images: ["/images/proj_legal_app.png"]
    },
    {
      name: "VoltWatch",
      category: "Android Native App",
      desc: "Modern Android battery monitoring application featuring interactive UI components, built with Jetpack Compose & MVVM architecture in pure Kotlin.",
      url: "",
      github: "https://github.com/SriramGandhiS/Batterymonitor",
      images: ["/images/proj_voltwatch.png"]
    }
  ];

  return (
    <section id="projects" className="bg-[#0C0C0C] z-30 relative px-5 sm:px-8 md:px-10 pt-24 pb-32 border-t border-[#D7E2EA]/10">
      <h2 className="hero-heading font-black uppercase text-center text-[clamp(2.5rem,8vw,120px)] mb-16 md:mb-24 leading-none tracking-tight">
        My Work
      </h2>
      
      <div ref={containerRef} className="relative w-full max-w-7xl mx-auto pb-20">
        {projects.map((project, i) => {
          const targetScale = 1 - ((projects.length - 1 - i) * 0.03);
          return (
            <ProjectCard 
              key={i}
              i={i}
              project={project}
              progress={scrollYProgress}
              range={[i * (1 / projects.length), 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section id="contact" className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-24 pb-32 border-t border-[#D7E2EA]/10 relative z-20 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 relative z-10">
        
        {/* Form Card */}
        <div className="flex-[1.2] bg-[#111] p-8 sm:p-10 rounded-[40px] border border-[#D7E2EA]/10 shadow-2xl">
           <p className="text-[#BE4C00] font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 block">— GET IN TOUCH</p>
           <h2 className="hero-heading font-black text-5xl sm:text-6xl uppercase mb-10 tracking-tight">Contact.</h2>
           
           <form action="https://api.web3forms.com/submit" method="POST" className="flex flex-col gap-6">
             <input type="hidden" name="access_key" value="5064c2a2-a780-45ad-9796-9d8fc275b189" />
             
             <label className="flex flex-col gap-2">
               <span className="text-[#D7E2EA]/80 font-medium">Your Name</span>
               <input type="text" name="name" required placeholder="What's your name?" className="bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#B600A8]" />
             </label>
             <label className="flex flex-col gap-2">
               <span className="text-[#D7E2EA]/80 font-medium">Your Email</span>
               <input type="email" name="email" required placeholder="What's your email?" className="bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#B600A8]" />
             </label>
             <label className="flex flex-col gap-2">
               <span className="text-[#D7E2EA]/80 font-medium">Your Message</span>
               <textarea rows={5} name="message" required placeholder="What do you want to say?" className="bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#B600A8]"></textarea>
             </label>
             
             <button type="submit" className="bg-gradient-to-r from-[#B600A8] to-[#BE4C00] text-white font-bold uppercase tracking-widest py-4 rounded-2xl hover:scale-[1.02] transition-transform">Send Message</button>
             
             {/* Navigation Links */}
             <div className="flex justify-center gap-6 sm:gap-8 mt-4 pt-8 border-t border-[#D7E2EA]/10">
               <a href="mailto:iamramm8@gmail.com" className="flex flex-col items-center gap-3 group">
                 <div className="p-3 bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-full group-hover:border-[#B600A8] group-hover:scale-110 transition-all shadow-xl"><MailIcon className="w-5 h-5 text-[#D7E2EA]/80 group-hover:text-white" /></div>
                 <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/60 font-bold group-hover:text-white transition-colors">Email</span>
               </a>
               <a href="https://github.com/SriramGandhiS" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 group">
                 <div className="p-3 bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-full group-hover:border-[#B600A8] group-hover:scale-110 transition-all shadow-xl"><GithubIcon className="w-5 h-5 text-[#D7E2EA]/80 group-hover:text-white" /></div>
                 <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/60 font-bold group-hover:text-white transition-colors">GitHub</span>
               </a>
               <a href="https://linkedin.com/in/sriram-s-432a99296" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 group">
                 <div className="p-3 bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-full group-hover:border-[#B600A8] group-hover:scale-110 transition-all shadow-xl"><LinkedinIcon className="w-5 h-5 text-[#D7E2EA]/80 group-hover:text-white" /></div>
                 <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/60 font-bold group-hover:text-white transition-colors">LinkedIn</span>
               </a>
             </div>
           </form>
        </div>

        {/* 3D Earth / Setup Replacement */}
        <div className="flex-1 flex items-center justify-center">
           <div className="relative w-full max-w-[400px] aspect-square rounded-[40px] bg-gradient-to-br from-[#5227FF] via-[#FF9FFC] to-[#B19EEF] p-[2px] shadow-[0_0_50px_rgba(182,0,168,0.2)] hover:shadow-[0_0_80px_rgba(182,0,168,0.4)] transition-shadow duration-500">
             <div className="w-full h-full bg-[#111] rounded-[38px] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <div className="w-[80%] h-[80%] border-2 border-white border-dashed rounded-full animate-[spin_20s_linear_infinite]"></div>
                   <div className="w-[60%] h-[60%] border border-white rounded-full absolute animate-[spin_15s_linear_infinite_reverse]"></div>
                </div>
                <h3 className="text-4xl sm:text-5xl font-black text-white z-10 mb-2 tracking-tight">SRIRAM S</h3>
                <p className="text-white/60 font-medium tracking-widest uppercase z-10">Software Engineer</p>
                <div className="mt-10 flex gap-6 z-10">
                   <a href="https://github.com/SriramGandhiS" target="_blank" rel="noreferrer" className="p-4 bg-[#0C0C0C] rounded-full border border-[#D7E2EA]/20 hover:border-white hover:scale-110 transition-all group">
                     <GithubIcon className="w-6 h-6 text-[#D7E2EA]/80 group-hover:text-white" />
                   </a>
                   <a href="https://linkedin.com/in/sriram-s-432a99296" target="_blank" rel="noreferrer" className="p-4 bg-[#0C0C0C] rounded-full border border-[#D7E2EA]/20 hover:border-white hover:scale-110 transition-all group">
                     <LinkedinIcon className="w-6 h-6 text-[#D7E2EA]/80 group-hover:text-white" />
                   </a>
                </div>
             </div>
           </div>
        </div>

      </div>
    </section>
  )
}

const ResumeCertSection = ({ setActiveModal }: { setActiveModal: (v: string) => void }) => {
  return (
    <section id="resume" className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-24 pb-24 border-t border-[#D7E2EA]/10 relative z-20">
      <h2 className="hero-heading font-black uppercase text-center text-[clamp(2.5rem,8vw,120px)] mb-16 leading-none tracking-tight">
        Credentials
      </h2>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <button onClick={() => setActiveModal('resume')} className="flex-1 bg-gradient-to-br from-[#18011F] to-[#0C0C0C] rounded-[40px] p-10 border border-[#B600A8]/30 hover:border-[#B600A8] transition-all group flex flex-col items-center justify-center text-center gap-6 shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-[#B600A8]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Download className="w-10 h-10 text-[#B600A8]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-3xl font-black uppercase text-[#D7E2EA] mb-3">Download Resume</h3>
            <p className="text-[#D7E2EA]/60 font-light text-lg">Get a copy of my professional CV</p>
          </div>
        </button>

        <div className="flex-[2] bg-[#111] rounded-[40px] p-8 sm:p-10 border border-[#D7E2EA]/10 flex flex-col justify-center shadow-2xl">
           <div className="flex items-center gap-4 mb-8">
             <FileBadge className="w-8 h-8 text-[#BE4C00]" />
             <h3 className="text-2xl font-black uppercase text-[#D7E2EA]">Certifications</h3>
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <Database className="w-10 h-10 text-[#BE4C00]" />, label: 'MongoDB' }, 
                { icon: <Code2 className="w-10 h-10 text-[#BE4C00]" />, label: 'HackerRank' }, 
                { icon: <Cloud className="w-10 h-10 text-[#BE4C00]" />, label: 'AWS' }, 
                { icon: <Cpu className="w-10 h-10 text-[#BE4C00]" />, label: 'Arduino' }
              ].map((cert, idx) => (
                <button key={idx} onClick={() => setActiveModal('certificates')} className="block rounded-2xl overflow-hidden border border-[#D7E2EA]/10 hover:border-[#BE4C00]/50 hover:scale-105 transition-all bg-[#0C0C0C] relative group py-8 flex flex-col items-center justify-center">
                  <div className="mb-3 opacity-80 group-hover:opacity-100 transition-opacity">{cert.icon}</div>
                  <span className="text-white/60 font-bold uppercase tracking-wider text-xs">{cert.label}</span>
                </button>
              ))}
           </div>
           <p className="text-[#D7E2EA]/50 text-sm mt-8 text-center font-medium uppercase tracking-widest">Total of 20 Professional Certifications • Click to open portfolio</p>
        </div>
      </div>
    </section>
  )
};

const IconMarqueeSection = () => {
  return (
    <div className="bg-[#0C0C0C] py-8 overflow-hidden flex whitespace-nowrap relative border-t border-[#D7E2EA]/10 z-20">
      <style>{`
        @keyframes iconticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-iconticker {
          animation: iconticker 15s linear infinite;
        }
      `}</style>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0C] via-transparent to-[#0C0C0C] z-10 w-full pointer-events-none"></div>
      
      <div className="flex animate-iconticker w-max">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-24 items-center shrink-0 pr-24">
            <a href="https://github.com/SriramGandhiS" target="_blank" rel="noreferrer" className="text-[#D7E2EA]/40 hover:text-[#D7E2EA]/80 transition-colors">
              <GithubIcon className="w-10 h-10" />
            </a>
            <a href="https://linkedin.com/in/sriram-s-432a99296" target="_blank" rel="noreferrer" className="text-[#D7E2EA]/40 hover:text-[#D7E2EA]/80 transition-colors">
              <LinkedinIcon className="w-10 h-10" />
            </a>
            <a href="mailto:iamramm8@gmail.com" className="text-[#D7E2EA]/40 hover:text-[#D7E2EA]/80 transition-colors">
              <MailIcon className="w-10 h-10" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="w-full bg-[#0C0C0C] text-[#D7E2EA] font-sans antialiased">
      <HeroSection setActiveModal={setActiveModal} />
      <TextMarqueeSection />
      <AboutSection />
      <AchievementsSection />
      <ProjectsSection />
      <ContactSection />
      <ResumeCertSection setActiveModal={setActiveModal} />
      <IconMarqueeSection />
      <CredentialsModal activeModal={activeModal} setActiveModal={setActiveModal} />
    </div>
  );
}

export default App;
