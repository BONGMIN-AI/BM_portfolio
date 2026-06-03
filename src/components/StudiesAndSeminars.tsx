import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Presentation, Globe, ArrowRight, ArrowLeft, Layers, ShieldAlert } from 'lucide-react';
import { TRANSLATIONS, PRESENTATIONS_TRANSLATIONS } from '../translations';

interface StudiesAndSeminarsProps {
  language: 'ko' | 'en';
}

export default function StudiesAndSeminars({ language }: StudiesAndSeminarsProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const presentation = PRESENTATIONS_TRANSLATIONS[language] || PRESENTATIONS_TRANSLATIONS.ko;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % presentation.slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + presentation.slides.length) % presentation.slides.length);
  };

  return (
    <section id="studies" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute right-10 top-20 w-80 h-80 rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-left mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6" id="studies-heading">
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-3">
              {TRANSLATIONS[language].studiesHeaderBadge}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {TRANSLATIONS[language].studiesTitle}
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-mono">
            {TRANSLATIONS[language].studiesDescLine}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left: Presentation Slide Deck */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-between p-8 bg-slate-950 text-slate-100 rounded-3xl shadow-xl border border-slate-800 relative min-h-[420px]" id="studies-slides-deck">
            <div>
              {/* Slideshow Top bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                    <Presentation size={15} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold">
                    {TRANSLATIONS[language].studiesSeminarLabel}
                  </span>
                </div>
                
                <span className="text-[10px] font-mono text-slate-500 tracking-widest">
                  SLIDE {activeSlide + 1} / {presentation.slides.length}
                </span>
              </div>

              {/* Title & Sub */}
              <div className="text-left mb-6">
                <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1 leading-tight text-left">
                  {presentation.title}
                </h3>
                <p className="text-xs font-mono text-slate-400 text-left">
                  {presentation.subtitle}
                </p>
              </div>

              {/* Slide content container */}
              <div className="min-h-[160px] text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 text-left"
                    id={`slide-content-${activeSlide}`}
                  >
                    <span className="text-xs font-mono font-bold text-blue-400 border-b border-slate-900 pb-1 inline-block uppercase">
                      {presentation.slides[activeSlide].title}
                    </span>
                    <ul className="flex flex-col gap-3 text-left">
                      {presentation.slides[activeSlide].content.map((bullet, idx) => (
                        <li key={idx} className="text-slate-350 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 text-left">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 animate-pulse" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-5 mt-6">
              <span className="text-[10px] font-mono text-slate-500">
                {TRANSLATIONS[language].studiesHost}: {language === 'ko' ? '한국폴리텍대학 청주캠퍼스' : 'Korea Polytechnic Univ'}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 bg-slate-905 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 active:scale-95 transition-all rounded-lg cursor-pointer"
                  id="slide-prev-btn"
                >
                  <ArrowLeft size={14} />
                </button>
                <div className="flex gap-1">
                  {presentation.slides.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1 transition-all ${idx === activeSlide ? 'w-4 bg-blue-500' : 'w-1.5 bg-slate-800'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="p-2 bg-slate-905 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 active:scale-95 transition-all rounded-lg cursor-pointer"
                  id="slide-next-btn"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Global competence description */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-105 dark:border-slate-800 shadow-sm relative min-h-[420px]" id="studies-global-card">
            
            <div className="text-left">
              <div className="inline-flex p-3.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
                <Globe size={20} />
              </div>

              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2 text-left">
                {TRANSLATIONS[language].studiesGlobalTitle}
              </h3>
              <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-4 text-left">
                {TRANSLATIONS[language].studiesGlobalSubtitle}
              </p>

              <hr className="border-slate-205 dark:border-slate-800 my-4" />

              <div className="flex flex-col gap-4 text-left font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2" id="global-competencies-desc">
                <div className="flex gap-3 items-start text-left">
                  <div className="p-1 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-blue-600 dark:text-blue-405 shadow-sm shrink-0 mt-0.5">
                    <Layers size={13} />
                  </div>
                  <p className="text-left">
                    {language === 'ko' ? (
                      <>
                        <strong>기술 정보 분석:</strong> 최신 오픈 소스 레포지토리와 메카트로닉스 엔지니어링 영문 가이드 및 공식 데이터 시트(Data Sheets)를 독립적으로 분석하고 해석하는 역량을 배양하고 있습니다.
                      </>
                    ) : (
                      <>
                        <strong>Technical Analytics:</strong> Independently analyzing complex datasheets, English-language mechatronics specification guidelines, and open-source GitHub repositories.
                      </>
                    )}
                  </p>
                </div>

                <div className="flex gap-3 items-start text-left">
                  <div className="p-1 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-blue-600 dark:text-blue-405 shadow-sm shrink-0 mt-0.5">
                    <ShieldAlert size={13} />
                  </div>
                  <p className="text-left">
                    {language === 'ko' ? (
                      <>
                        <strong>비즈니스 커뮤니케이션:</strong> 기술 사양 논의 및 글로벌 커뮤니티(GitHub, Discord)에서의 원활한 개발 협업을 위해 메카트로닉스/비즈니스 실무 영어 커뮤니케이션 능력을 지속적으로 섭렵하고 있습니다.
                      </>
                    ) : (
                      <>
                        <strong>Engineering Collaboration:</strong> Engaging with global development channels (GitHub, Discord) and handling engineering/business specs dialogs in fluent English.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Static learning strategy bottom bar */}
            <div className="text-left border-t border-slate-200/60 dark:border-slate-850 pt-5 mt-6 text-[10px] font-mono text-slate-400 uppercase select-none">
              {TRANSLATIONS[language].studiesGlobalStrategy}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
