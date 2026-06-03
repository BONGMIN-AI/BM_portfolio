import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Menu, X, Cpu, Send, Sun, Moon, Languages } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface NavbarProps {
  activeSection: string;
  language: 'ko' | 'en';
  setLanguage: (lang: 'ko' | 'en') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Navbar({ activeSection, language, setLanguage, darkMode, setDarkMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: TRANSLATIONS[language].navAbout },
    { id: 'skills', label: TRANSLATIONS[language].navSkills },
    { id: 'projects', label: TRANSLATIONS[language].navProjects },
    { id: 'education', label: TRANSLATIONS[language].navEducation },
    { id: 'studies', label: TRANSLATIONS[language].navStudies },
  ];

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
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
    <nav
      id="portfolio-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-md py-3 border-b border-slate-100 dark:border-slate-800'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo/Name */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          id="nav-logo"
        >
          <div className="p-2 bg-blue-600 rounded-xl text-white group-hover:scale-110 transition-transform shadow-blue-500/20 shadow-md">
            <Cpu size={18} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight leading-none">Bomin.AI</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono tracking-wider font-semibold uppercase mt-0.5">Mechatronics</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8" id="desktop-menu">
          <div className="flex bg-slate-100/70 dark:bg-slate-800 p-1 rounded-full border border-slate-200/50 dark:border-slate-700">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleScrollTo(item.id)}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Combined Desktop Toggles set */}
          <div className="flex items-center gap-3">
            {/* Language switch */}
            <button
              onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-400 transition-all cursor-pointer select-none"
              title="Switch Language / 언어 전환"
              id="language-toggle-desktop"
            >
              <Languages size={13} className="text-blue-500 mr-0.5" />
              <span>{language === 'ko' ? 'KO' : 'EN'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-500 dark:hover:text-amber-400 transition-all cursor-pointer select-none"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="dark-mode-toggle-desktop"
            >
              {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
            </button>
          </div>

          <button
            id="nav-cta-button"
            onClick={() => handleScrollTo('contact')}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-full hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white active:scale-95 transition-all shadow-md shadow-slate-900/10 cursor-pointer"
          >
            {TRANSLATIONS[language].contactBtn}
            <Send size={13} />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2" id="mobile-menu-toggle">
          {/* Quick controls set */}
          <button
            onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 text-slate-800 dark:text-slate-200 select-none cursor-pointer"
            id="language-toggle-mobile"
          >
            <Languages size={11} className="text-blue-500" />
            <span>{language === 'ko' ? 'KO' : 'EN'}</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 text-slate-800 dark:text-slate-200 select-none cursor-pointer"
            id="dark-mode-toggle-mobile"
          >
            {darkMode ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-slate-500" />}
          </button>

          <button
            id="mobile-cta"
            onClick={() => handleScrollTo('contact')}
            className="px-3 py-1.5 text-[10px] font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-955 rounded-full cursor-pointer"
          >
            {TRANSLATIONS[language].navCtaMobile}
          </button>
          
          <button
            id="mobile-hamburger"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-slate-800 dark:text-slate-200 focus:outline-none hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => handleScrollTo(item.id)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <hr className="border-slate-100 dark:border-slate-800 my-1" />
              <button
                id="mobile-contact-cta"
                onClick={() => handleScrollTo('contact')}
                className="w-full py-2.5 text-center text-sm font-bold bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bot size={16} />
                {TRANSLATIONS[language].navEmailBtn}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
