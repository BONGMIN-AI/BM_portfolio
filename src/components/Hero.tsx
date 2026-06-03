import { motion } from 'motion/react';
import { Bot, Cpu, ChevronRight, Binary } from 'lucide-react';
import { PERSONAL_INFO } from '../data';
import { TRANSLATIONS, QUICK_STATS_TRANSLATIONS } from '../translations';

interface HeroProps {
  language: 'ko' | 'en';
}

export default function Hero({ language }: HeroProps) {
  const quickStatsMapped = QUICK_STATS_TRANSLATIONS[language];

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section 
      id="about" 
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900/20 dark:via-slate-950 dark:to-slate-950 overflow-hidden"
    >
      {/* Background Decorative Grids (Thin line blueprint style) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Futuristic soft cyan/blue radial glows */}
      <div className="absolute -top-40 right-10 w-[500px] h-[500px] rounded-full bg-blue-300/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-20 -left-20 w-[400px] h-[400px] rounded-full bg-cyan-200/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Details */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Custom high-tech badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-105 dark:border-blue-900/60 text-blue-750 dark:text-blue-350 font-mono text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Cpu size={12} className="animate-spin [animation-duration:10s]" />
              {TRANSLATIONS[language].heroBadge}
            </motion.div>

            {/* Display Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6"
            >
              {language === 'ko' ? (
                <>
                  소프트웨어 <span className="text-blue-600 dark:text-blue-450 underline decoration-blue-200 dark:decoration-blue-900/50 decoration-8 underline-offset-4">지능</span>과<br />
                  물리 <span className="text-slate-800 dark:text-slate-100">로봇의 완벽한 융합</span>
                </>
              ) : (
                <>
                  Perfect Fusion of <span className="text-blue-600 dark:text-blue-450 underline decoration-blue-200 dark:decoration-blue-900/50 decoration-8 underline-offset-4">Software Intelligence</span> &<br />
                  <span className="text-slate-800 dark:text-slate-100">Physical Robots</span>
                </>
              )}
            </motion.h1>

            {/* Core Quote Accent */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border-l-4 border-blue-500 pl-4 py-1.5 mb-6 text-lg sm:text-xl font-medium text-slate-805 dark:text-slate-200 leading-relaxed max-w-2xl"
            >
              "{TRANSLATIONS[language].heroQuote}"
            </motion.div>

            {/* Narrative Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-350 leading-relaxed mb-8 max-w-2xl"
            >
              {TRANSLATIONS[language].heroDescription}
            </motion.p>

            {/* Interactive Hero Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 items-center mb-12"
            >
              <button
                onClick={() => handleScrollTo('projects')}
                className="group flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-slate-900 dark:hover:bg-slate-100 dark:hover:text-slate-950 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm sm:text-base cursor-pointer"
              >
                {TRANSLATIONS[language].heroExploreBtn}
                <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
              <button
                onClick={() => handleScrollTo('contact')}
                className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-blue-300 font-semibold rounded-full hover:bg-blue-50/20 dark:hover:bg-slate-800 active:scale-95 transition-all text-sm sm:text-base cursor-pointer"
              >
                {TRANSLATIONS[language].heroContactBtn}
              </button>
            </motion.div>

            {/* Multi-metrics banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm"
            >
              {quickStatsMapped.map((stat, i) => (
                <div key={i} className="flex flex-col border-r last:border-0 border-slate-100 dark:border-slate-800 pr-2 text-left">
                  <span className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight mb-1">{stat.value}</span>
                  <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 tracking-tight uppercase leading-tight">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Mechatronics conceptual portrait/collage */}
          <div className="lg:col-span-5 flex justify-center items-center relative lg:pl-6">
            
            {/* Visual background rotating rings indicating mechatronics telemetry */}
            <motion.div 
              className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] border border-dashed border-blue-200 dark:border-blue-900/40 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div 
              className="absolute w-[320px] h-[320px] sm:w-[370px] sm:h-[370px] border border-blue-100 dark:border-blue-900/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Main Circle Image Framed with visual mechatronics glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="relative w-[280px] h-[280px] sm:w-[330px] sm:h-[330px] rounded-full bg-blue-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden z-20 group"
            >
              <img
                src={PERSONAL_INFO.profileImage}
                alt={PERSONAL_INFO.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-102 hover:scale-110 transition-transform duration-700"
              />
              {/* Overlay mechatronics grid */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/45 via-transparent to-transparent opacity-60 mix-blend-overlay" />
            </motion.div>

            {/* Glowing floating hardware telemetry card 1 */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="absolute top-2 right-4 sm:right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg z-30 flex items-center gap-3"
            >
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Bot size={18} className="animate-bounce" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-205">YOLOv8 ViT Engine</span>
                <span className="text-[10px] font-semibold text-emerald-500">RUNNING | 60FPS</span>
              </div>
            </motion.div>

            {/* Glowing floating hardware telemetry card 2 */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-2 left-4 sm:left-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg z-30 flex items-center gap-3"
            >
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Binary size={18} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-205">PID Servo Loop</span>
                <span className="text-[10px] font-semibold text-blue-500">STABILIZED | Ki: 0.12</span>
              </div>
            </motion.div>

            {/* Quick school banner floating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="absolute -bottom-8 bg-blue-600 text-white font-mono text-center px-4 py-2 rounded-full border border-blue-500 text-xs font-semibold shadow-md z-30"
            >
              POLYTECHNIC AI DEEP LEARNING DEV
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
