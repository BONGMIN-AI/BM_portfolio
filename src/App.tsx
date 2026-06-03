import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkillsGrid from './components/SkillsGrid';
import ProjectsSection from './components/ProjectsSection';
import EducationTimeline from './components/EducationTimeline';
import StudiesAndSeminars from './components/StudiesAndSeminars';
import InterationsAndContact from './components/InterationsAndContact';

export default function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('darkMode') === 'true';
      } catch (e) {
        console.warn('LocalStorage is not available:', e);
      }
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('darkMode', 'true');
      } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('darkMode', 'false');
      } catch (e) {}
    }
  }, [darkMode]);

  useEffect(() => {
    const sections = ['about', 'skills', 'projects', 'education', 'studies', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for better detection triggers

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial verification
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased transition-colors selection:bg-blue-600 selection:text-white">
      {/* Dynamic Floating Navigation */}
      <Navbar 
        activeSection={activeSection} 
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Structured Modules */}
      <main>
        <Hero language={language} />
        <SkillsGrid language={language} />
        <ProjectsSection language={language} />
        <EducationTimeline language={language} />
        <StudiesAndSeminars language={language} />
        <InterationsAndContact language={language} />
      </main>
    </div>
  );
}
