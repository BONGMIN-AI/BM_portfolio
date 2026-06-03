import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Copy, Check, Send, Bot, Cpu, Github } from 'lucide-react';
import { PERSONAL_INFO } from '../data';
import { TRANSLATIONS } from '../translations';

interface InterationsAndContactProps {
  language: 'ko' | 'en';
}

export default function InterationsAndContact({ language }: InterationsAndContactProps) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [feedbackLog, setFeedbackLog] = useState<string[]>(
    language === 'ko' 
      ? [
          '[SYSTEM] 메시지 게이트웨이 활성화.',
          '[UART] 외부 수신 신호 대기 중...'
        ]
      : [
          '[SYSTEM] Message gateway active.',
          '[UART] Listening for recruiter input queries...'
        ]
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setIsCopied(true);
    setFeedbackLog((prev) => [
      language === 'ko'
        ? `[UART] 이메일 주소 ${PERSONAL_INFO.email} 복사 완료!`
        : `[UART] Copied email address ${PERSONAL_INFO.email} to system clipboard!`,
      ...prev
    ]);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const addFeedbackLog = (msg: string) => {
    setFeedbackLog((prev) => [msg, ...prev]);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      addFeedbackLog(
        language === 'ko'
          ? '[ERROR] 모든 필드를 채워주십시오.'
          : '[ERROR] Validation error: All fields are required.'
      );
      return;
    }

    setIsSubmitting(true);
    addFeedbackLog(
      language === 'ko'
        ? `[UART] ${formState.email}로부터 패키지 송출 시도...`
        : `[UART] Transmitting contact package from ${formState.email}...`
    );

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      addFeedbackLog(
        language === 'ko'
          ? `[SYSTEM] 성공적으로 송출 완료! 감사합니다, ${formState.name}님.`
          : `[SYSTEM] Package successfully sent! Thank you, ${formState.name}.`
      );
      setFormState({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      className="py-24 bg-slate-950 text-slate-100 relative overflow-hidden"
    >
      {/* Aesthetic blueprint backdrop grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" />
      
      {/* Electric blue glowing orbits matching the mechatronics slider mockup */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-mono font-bold text-blue-400 tracking-widest block mb-3">
            {TRANSLATIONS[language].contactHeaderBadge}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 text-center">
            {TRANSLATIONS[language].contactTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium text-center">
            {TRANSLATIONS[language].contactDescList}
          </p>
        </div>

        {/* Outer Split Card Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" id="contact-split-grid">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-12 xl:col-span-7 bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-3xl text-left shadow-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-black text-slate-500 uppercase tracking-widest block mb-6 select-none border-b border-slate-800 pb-2.5">
                SECURE MESSAGE TRANSMISSION GATEWAY
              </span>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleFormSubmit} 
                    className="flex flex-col gap-5 text-left"
                    id="contact-form"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5" id="contact-input-name">
                        <label className="text-xs font-mono font-semibold text-slate-400">
                          {TRANSLATIONS[language].contactName}
                        </label>
                        <input
                          type="text"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder={TRANSLATIONS[language].contactNamePlaceholder}
                          className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-sm font-sans focus:outline-none focus:border-blue-500 text-slate-100 transition-colors w-full"
                          required
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1.5" id="contact-input-email">
                        <label className="text-xs font-mono font-semibold text-slate-400">
                          {TRANSLATIONS[language].contactEmail}
                        </label>
                        <input
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder={TRANSLATIONS[language].contactEmailPlaceholder}
                          className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-sm font-sans focus:outline-none focus:border-blue-500 text-slate-100 transition-colors w-full"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5" id="contact-input-msg">
                      <label className="text-xs font-mono font-semibold text-slate-400">
                        {TRANSLATIONS[language].contactMessage}
                      </label>
                      <textarea
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder={TRANSLATIONS[language].contactMessagePlaceholder}
                        rows={5}
                        className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-sm font-sans focus:outline-none focus:border-blue-500 text-slate-100 transition-colors resize-none w-full"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 flex items-center justify-center gap-2.5 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-2xl cursor-pointer disabled:cursor-not-allowed active:scale-98 transition-all"
                      id="contact-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <Cpu size={16} className="animate-spin text-blue-200" />
                          {TRANSLATIONS[language].contactSubmitBtnSending}
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          {TRANSLATIONS[language].contactSubmitBtnReady}
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                    id="contact-success"
                  >
                    <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-6 font-semibold">
                      <Check size={32} />
                    </div>
                    <h3 className="text-xl font-bold font-display text-white mb-2">
                      {TRANSLATIONS[language].contactSuccessTitle}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
                      {TRANSLATIONS[language].contactSuccessDesc}
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-705 font-mono text-xs rounded-xl border border-slate-700/60 cursor-pointer text-slate-200"
                    >
                      {TRANSLATIONS[language].contactSuccessReset}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Real-time telemetry feedback log from Contact form interaction */}
            <div className="mt-8 font-mono text-[9px] text-slate-500 border-t border-slate-800/80 pt-4 flex flex-col gap-1 text-left select-none">
              <span className="font-bold flex items-center gap-1.5 mb-1.5 text-slate-400">
                <Bot size={11} className="text-blue-400" />
                DEDICATED TELEMETRY TRANSCEIVER LOG
              </span>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/60 h-24 overflow-y-auto flex flex-col gap-1.5">
                {feedbackLog.map((log, i) => {
                  let logColor = 'text-slate-400';
                  if (log?.includes('[ERROR]')) logColor = 'text-red-400';
                  if (log?.includes('[SYSTEM]')) logColor = 'text-emerald-400';
                  if (log?.includes('[UART]')) logColor = 'text-blue-400';
                  return (
                    <div key={i} className={`leading-none ${logColor}`}>{log}</div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Cards & Copiers */}
          <div className="lg:col-span-12 xl:col-span-12 min-[1140px]:col-span-5 flex flex-col md:flex-row xl:flex-col gap-6 items-stretch justify-between">
            {/* Email copying card */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-left shadow-2xl flex flex-col justify-between flex-1" id="contact-email-card">
              <div>
                <span className="text-[10px] font-mono text-blue-400 tracking-wider block uppercase font-bold mb-4">DIRECT CHANNELS</span>
                <h3 className="font-display text-xl font-bold mb-1.5 text-white text-left">
                  {TRANSLATIONS[language].contactEmailCardTitle}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 text-left">
                  {TRANSLATIONS[language].contactEmailCardDesc}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between gap-4 font-mono">
                  <div className="flex items-center gap-3 shrink-0 overflow-hidden leading-none">
                    <Mail size={16} className="text-slate-500 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-300 font-semibold truncate select-none leading-none pt-0.5">
                      {PERSONAL_INFO.email}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleCopyEmail}
                    className={`p-2 rounded-xl transition-all border cursor-pointer ${
                      isCopied 
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title="Copy Email Address Address"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${PERSONAL_INFO.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-center font-bold text-xs sm:text-sm rounded-2xl font-mono border border-slate-700/50 block text-slate-250 cursor-pointer"
                >
                  {TRANSLATIONS[language].contactMailtoBtn}
                </a>
              </div>
            </div>

            {/* Social card */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-left shadow-2xl flex flex-col justify-between flex-1" id="contact-social-card">
              <div>
                <span className="text-[10px] font-mono text-blue-400 tracking-wider block uppercase font-bold mb-4">ENGINEERING SOURCE CODES</span>
                <h3 className="font-display text-xl font-bold mb-1.5 text-white text-left">
                  {TRANSLATIONS[language].contactSocialCardTitle}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 text-left">
                  {TRANSLATIONS[language].contactSocialCardDesc}
                </p>
              </div>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-white text-slate-950 hover:bg-blue-600 hover:text-white font-black text-xs sm:text-sm rounded-2xl tracking-wider active:scale-95 transition-all text-center leading-none"
                id="social-github-btn"
              >
                <Github size={18} />
                <span>{TRANSLATIONS[language].contactGoGithubBtn}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer (Matches mechatronics styling from the bottom of attached image) */}
        <hr className="border-slate-800/60 my-16" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 text-left select-none text-slate-500 text-xs leading-relaxed" id="footer-copyright">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <span className="font-bold text-slate-400 font-mono">Bomin.AI</span>
            <span>&copy; {new Date().getFullYear()} {language === 'ko' ? '김보민 Portfolio' : 'Bomin Kim Portfolio'}. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span>CORE VERSION: 2.1</span>
            <span>/</span>
            <span>MADE IN MECHATRONICS LAB</span>
          </div>
        </div>

      </div>
    </section>
  );
}
