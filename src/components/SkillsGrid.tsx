import { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Cpu, Code, CheckCircle, Terminal } from 'lucide-react';
import { SKILL_GROUPS } from '../data';
import { TRANSLATIONS, SKILL_DESC_TRANSLATIONS, SKILL_DETAILS_TRANSLATIONS } from '../translations';

interface SkillsGridProps {
  language: 'ko' | 'en';
}

export default function SkillsGrid({ language }: SkillsGridProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('ai-vision');

  const getGroupIcon = (id: string, size = 20) => {
    switch (id) {
      case 'ai-vision':
        return <Bot size={size} />;
      case 'embedded-robotics':
        return <Cpu size={size} />;
      case 'programming-design':
        return <Code size={size} />;
      default:
        return <Terminal size={size} />;
    }
  };

  const getTabLabel = (id: string) => {
    if (language === 'ko') {
      switch (id) {
        case 'ai-vision': return "인공지능 비전";
        case 'embedded-robotics': return "임베디드 제어";
        case 'programming-design': return "프로그램 설계";
        default: return "";
      }
    } else {
      switch (id) {
        case 'ai-vision': return "AI & Vision";
        case 'embedded-robotics': return "Embedded Systems";
        case 'programming-design': return "Programming & CAD";
        default: return "";
      }
    }
  };

  return (
    <section id="skills" className="py-24 bg-slate-50 dark:bg-slate-950/40 border-y border-slate-100 dark:border-slate-800/80 relative overflow-hidden">
      {/* Decorative Blueprint circle */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full border border-slate-200/40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-450 uppercase tracking-widest block mb-3">
            {TRANSLATIONS[language].skillsHeaderBadge}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            {TRANSLATIONS[language].skillsTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 text-sm sm:text-base">
            {TRANSLATIONS[language].skillsDesc}
          </p>
        </div>

        {/* Tab Selection for Mobile & Desktop responsiveness */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {SKILL_GROUPS.map((group) => (
            <button
              key={group.id}
              id={`skill-tab-${group.id}`}
              onClick={() => setSelectedGroup(group.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                selectedGroup === group.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {getGroupIcon(group.id, 16)}
              {getTabLabel(group.id)}
            </button>
          ))}
        </div>

        {/* Main Grid Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Selected Skill Category Details */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm min-h-[380px]">
            {SKILL_GROUPS.map((group) => {
              if (group.id !== selectedGroup) return null;
              const translatedDesc = SKILL_DESC_TRANSLATIONS[language][group.id as 'ai-vision' | 'embedded-robotics' | 'programming-design'] || group.description;
              return (
                <div key={group.id} className="flex flex-col h-full justify-between" id={`skill-details-${group.id}`}>
                  <div>
                    <div className="inline-flex p-3.5 bg-blue-50 dark:bg-blue-950/55 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
                      {getGroupIcon(group.id, 24)}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3 text-left">
                      {language === 'ko' ? group.category : group.enCategory || group.category}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-350 text-sm leading-relaxed mb-8 text-left">
                      {translatedDesc}
                    </p>
                  </div>

                  {/* High tech stats board */}
                  <div className="bg-slate-50/70 dark:bg-slate-950/70 p-5 rounded-2xl border border-slate-100/60 dark:border-slate-800/60 font-mono text-xs text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-500 dark:text-slate-450">{TRANSLATIONS[language].skillsProfile}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{TRANSLATIONS[language].skillsReady}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-500 dark:text-slate-450">{TRANSLATIONS[language].skillsCoreModules}</span>
                      <span className="text-slate-800 dark:text-slate-200">{group.items.length}{TRANSLATIONS[language].skillsUnits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-450">{TRANSLATIONS[language].skillsOperatingBand}</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {group.id === 'ai-vision' ? 'Python / PyTorch / OpenCV' : group.id === 'embedded-robotics' ? 'C++ / Ladder / UART' : 'SolidWorks / AutoCAD'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right panel: Progressive bars with descriptive bullet items */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-4 w-full">
            {SKILL_GROUPS.map((group) => {
              if (group.id !== selectedGroup) return null;
              return (
                <div key={group.id} className="flex flex-col gap-4 w-full">
                  {group.items.map((item, index) => {
                    const translatedDetail = SKILL_DETAILS_TRANSLATIONS[language][item.name as keyof typeof SKILL_DETAILS_TRANSLATIONS['ko']] || item.details;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-105 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
                        id={`skill-card-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <div className="flex items-start gap-3 text-left max-w-lg">
                          <div className="p-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg shrink-0 mt-0.5">
                            <CheckCircle size={14} />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors text-base">
                              {item.name}
                            </h4>
                            <p className="text-slate-500 dark:text-slate-350 text-xs sm:text-sm mt-0.5 leading-relaxed">
                              {translatedDetail}
                            </p>
                          </div>
                        </div>

                        {/* Customized mechatronics indicator gauge */}
                        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                          <span className="text-xs font-mono font-bold text-slate-400">{TRANSLATIONS[language].skillsLevel}</span>
                          <div className="w-24 sm:w-28 bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.level}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="bg-blue-600 h-full rounded-full"
                            />
                          </div>
                          <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 w-8 text-right">
                            {item.level}%
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
