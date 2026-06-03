import { motion } from 'motion/react';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import { TRANSLATIONS, EDUCATION_TRANSLATIONS } from '../translations';

interface EducationTimelineProps {
  language: 'ko' | 'en';
}

export default function EducationTimeline({ language }: EducationTimelineProps) {
  const dataset = EDUCATION_TRANSLATIONS[language] || EDUCATION_TRANSLATIONS.ko;

  return (
    <section id="education" className="py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 relative overflow-hidden">
      {/* Decorative vertical blueprint lines */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200/50 dark:bg-slate-800/50 hidden md:block" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-3">
            {TRANSLATIONS[language].eduHeaderBadge}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            {TRANSLATIONS[language].eduTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-350 text-sm sm:text-base font-mono">
            {TRANSLATIONS[language].eduDescLine}
          </p>
        </div>

        {/* Education Blocks */}
        <div className="flex flex-col gap-10 max-w-4xl mx-auto">
          {dataset.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-8 text-left"
              id="education-instit-card"
            >
              {/* Institution badge segment */}
              <div className="md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-8">
                <div>
                  <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-4">
                    <GraduationCap size={22} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1 text-left">
                    {edu.institution}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-3 text-left">
                    {edu.degree}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono font-semibold">
                  <Calendar size={13} />
                  <span>{edu.period}</span>
                </div>
              </div>

              {/* Course syllabus details expanded */}
              <div className="md:w-2/3 flex flex-col gap-5">
                <span className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-450 uppercase tracking-widest block mb-1 text-left">
                  {TRANSLATIONS[language].eduModulesBadge}
                </span>

                <div className="grid grid-cols-1 gap-4">
                  {edu.details.map((detail, idx) => {
                    const [title, desc] = detail.split(':');
                    return (
                      <div 
                        key={idx} 
                        className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-105 dark:border-slate-800 rounded-2xl hover:border-blue-100/60 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 transition-colors flex gap-3.5 items-start text-left"
                        id={`education-detail-item-${idx}`}
                      >
                        <div className="mt-1 p-1 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
                          <BookOpen size={11} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-display font-bold text-slate-900 dark:text-white text-sm">
                            {title}
                          </span>
                          <span className="text-slate-500 dark:text-slate-350 text-xs sm:text-sm mt-1 leading-relaxed">
                            {desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
