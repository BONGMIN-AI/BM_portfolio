import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap } from 'lucide-react';
import { PROJECTS_DATA } from '../data';
import { TRANSLATIONS, PROJECTS_TRANSLATIONS } from '../translations';
import ProjectSimulator from './ProjectSimulator';

interface ProjectsSectionProps {
  language: 'ko' | 'en';
}

export default function ProjectsSection({ language }: ProjectsSectionProps) {
  const [activeSimId, setActiveSimId] = useState<string | null>(null);

  const toggleSimulator = (id: string) => {
    setActiveSimId(activeSimId === id ? null : id);
  };

  return (
    <section id="projects" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Structural visual border grids reminiscent of industrial cad blueprints */}
      <div className="absolute inset-x-0 top-0 h-px bg-slate-100 dark:bg-slate-800" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-left mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6" id="projects-heading">
          <div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-3">
              {TRANSLATIONS[language].projectsHeaderBadge}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              {TRANSLATIONS[language].projectsTitle}
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md text-left font-mono leading-relaxed">
            {TRANSLATIONS[language].projectsDescLine}
          </p>
        </div>

        {/* Vertical Projects Timeline */}
        <div className="flex flex-col gap-20 md:gap-32">
          {PROJECTS_DATA.map((project, index) => {
            const isSimOpen = activeSimId === project.id;
            
            return (
              <div 
                key={project.id} 
                id={`project-row-${project.id}`}
                className="flex flex-col gap-8 scroll-mt-24"
              >
                {/* 1. Project Main Info Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Left Column: Descriptive texts */}
                  <div className="lg:col-span-7 flex flex-col items-start text-left">
                    {/* Project Index number */}
                    <div className="font-display font-bold text-5xl sm:text-6xl text-blue-200/60 dark:text-blue-900/30 leading-none tracking-tighter mb-4 font-mono select-none">
                      {project.number}
                    </div>

                    {/* Titles */}
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                      {PROJECTS_TRANSLATIONS[language][project.id as keyof typeof PROJECTS_TRANSLATIONS['ko']]?.title || project.title}
                    </h3>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 font-mono tracking-wider mb-5">
                      {PROJECTS_TRANSLATIONS[language][project.id as keyof typeof PROJECTS_TRANSLATIONS['ko']]?.subtitle || project.subtitle}
                    </div>

                    {/* Brief Synopsis description */}
                    <p className="text-slate-600 dark:text-slate-355 text-sm sm:text-base leading-relaxed mb-6">
                      {PROJECTS_TRANSLATIONS[language][project.id as keyof typeof PROJECTS_TRANSLATIONS['ko']]?.description || project.description}
                    </p>

                    {/* Roles & achievements lists */}
                    <div className="flex flex-col gap-3.5 mb-8 w-full text-left font-sans" id={`project-achievements-${project.id}`}>
                      <span className="text-xs font-mono font-bold text-slate-400 tracking-wider block border-b border-slate-100 dark:border-slate-800 pb-1.5 uppercase select-none">
                        {TRANSLATIONS[language].projectsAchievementsHeader}
                      </span>
                      {(PROJECTS_TRANSLATIONS[language][project.id as keyof typeof PROJECTS_TRANSLATIONS['ko']]?.achievements || project.roleAndAchievements).map((item, id) => (
                        <div key={id} className="flex gap-3 text-sm text-slate-600 dark:text-slate-350 leading-relaxed text-left items-start">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech tag chips & Simulator toggles */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 w-full border-t border-slate-100 dark:border-slate-800 pt-6">
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span 
                            key={tech} 
                            className="text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {project.simulation && (
                        <button
                          onClick={() => toggleSimulator(project.id)}
                          className={`flex items-center gap-2.5 px-5 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            isSimOpen 
                              ? 'bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/60' 
                              : 'bg-blue-600 text-white hover:bg-slate-900 dark:hover:bg-white dark:hover:text-amber-950 shadow-md shadow-blue-500/10'
                          }`}
                          id={`sim-toggle-${project.id}`}
                        >
                          <Zap size={13} className={isSimOpen ? 'animate-bounce' : 'animate-pulse'} />
                          {project.id === 'yolo-object-detection'
                            ? (isSimOpen 
                                ? (language === 'ko' ? '개발 과정 및 실증사진 닫기' : 'Close Details') 
                                : (language === 'ko' ? '개발 데이터 및 실증사진 보기' : 'View Dev Data & Photos')
                              )
                            : (isSimOpen 
                                ? TRANSLATIONS[language].projectsSimulatorToggleClose 
                                : TRANSLATIONS[language].projectsSimulatorToggleOpen
                              )
                          }
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: High Quality descriptive mechatronics graphics */}
                  <div className="lg:col-span-5 h-full flex items-center justify-center">
                    <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl group">
                      
                      {/* Interactive graphic overlay border */}
                      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      />
                      
                      {/* Blueprint metrics summary overlay (floating like Years Crafting) */}
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100/80 dark:border-slate-800 shadow-md flex items-center justify-between z-20">
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-450">{TRANSLATIONS[language].projectsHardwareType}</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                            {project?.id?.includes('yolo') ? 'VISION COPROCESSOR' : project?.id?.includes('pid') ? 'ROBOTIC VEHICLE' : project?.id?.includes('relay') ? 'SEQUENCE RELAY' : 'EMBEDDED CORES'}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-mono font-bold rounded-lg border border-blue-100 dark:border-blue-900/40">
                          VER 2.0
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. Collapsible interactive simulation playground */}
                <AnimatePresence>
                  {isSimOpen && (
                    <motion.div
                      id={`project-simulator-container-${project.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-6"
                      transition={{ duration: 0.4 }}
                    >
                      <div className="py-2">
                        <ProjectSimulator project={project} language={language} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
