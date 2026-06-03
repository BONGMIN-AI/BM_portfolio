import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, Cpu, HelpCircle, Activity, Info } from 'lucide-react';
import { Project } from '../types';
import YoloDashboard from './YoloDashboard';

interface ProjectSimulatorProps {
  project: Project;
  language?: 'ko' | 'en';
}

export default function ProjectSimulator({ project, language = 'ko' }: ProjectSimulatorProps) {
  if (project.id === 'yolo-object-detection') {
    return <YoloDashboard language={language} />;
  }

  const type = project.simulation?.type;
  
  // Simulation Controller States
  const [isRunning, setIsRunning] = useState(false);
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const vals: Record<string, any> = {};
    project.simulation?.controls.forEach(c => {
      vals[c.key] = c.defaultValue;
    });
    return vals;
  });

  // Simulator Internal States
  // 1. YOLO States
  const [fps, setFps] = useState(60);
  const [detectedCount, setDetectedCount] = useState(2);
  
  // 2. PID States (Interrupt Line Tracer States)
  const [pidError, setPidError] = useState<number[]>(Array(30).fill(0));
  const [carX, setCarX] = useState(150);
  const [trackX, setTrackX] = useState(150);
  const [carDirection, setCarDirection] = useState(1);
  const [sensorVals, setSensorVals] = useState<number[]>([120, 120, 950, 950, 120, 120]);
  const [lastInterrupt, setLastInterrupt] = useState<'NONE' | 'LEFT' | 'RIGHT'>('NONE');
  const pidChartRef = useRef<HTMLCanvasElement | null>(null);

  // 3. Relay States
  const [latchActive, setLatchActive] = useState(false);

  // 4. Pomodoro States
  const [pomoState, setPomoState] = useState<'INIT' | 'IDLE' | 'STUDY' | 'BREAK' | 'PAUSE'>('INIT');
  const [pomoPreState, setPomoPreState] = useState<'IDLE' | 'STUDY' | 'BREAK'>('IDLE');
  const [pomoTimeLeft, setPomoTimeLeft] = useState(1500); // countdown in seconds
  const [pomoTotalStudy, setPomoTotalStudy] = useState(1500); // total configured study in seconds
  const [pomoTotalBreak, setPomoTotalBreak] = useState(300); // total configured break in seconds
  const [pomoPauseRemain, setPomoPauseRemain] = useState(300); // auto-resume limit (300 secs)
  
  const [alert50, setAlert50] = useState(false);
  const [alert20, setAlert20] = useState(false);
  const [alert3, setAlert3] = useState(false);

  const [ledRed, setLedRed] = useState(false);
  const [ledGreen, setLedGreen] = useState(false);
  const [ledYellow, setLedYellow] = useState(false);
  
  const [buzzerActive, setBuzzerActive] = useState(false);

  const [serialLogs, setSerialLogs] = useState<string[]>(['[SYS] System booted.', '[UART] UART interface active. I2C LCD ready.']);

  // Handle Controls change
  const handleControlChange = (key: string, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    const logVal = typeof value === 'boolean' ? (value ? 'HIGH (1)' : 'LOW (0)') : value;
    addSerialLog(`[PARAM] Parameter update: ${key} = ${logVal}`);
  };

  const addSerialLog = (msg: string) => {
    setSerialLogs(prev => [msg, ...prev.slice(0, 18)]);
  };

  // Web Audio Synth Tone Generator support (Wokwi Buzzer simulation)
  const playTone = (freq: number, durationMs: number) => {
    setBuzzerActive(true);
    setTimeout(() => setBuzzerActive(false), durationMs);

    if (inputs['buzzer'] === 'Mute (무음)') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {
      console.warn("AudioContext failed:", e);
    }
  };

  const triggerStartSound = () => {
    addSerialLog("[BUZZER] startSound()");
    playTone(988, 80);
    setTimeout(() => playTone(1319, 250), 80);
  };

  const triggerEndSound = () => {
    addSerialLog("[BUZZER] endSound() - Cycle Done!");
    playTone(450, 120);
    setTimeout(() => {
      playTone(400, 120);
      setTimeout(() => {
        playTone(350, 150);
      }, 120);
    }, 120);
  };

  const triggerBeepShort = () => {
    addSerialLog("[BUZZER] beepShort() warning!");
    playTone(300, 100);
  };

  const triggerBeepDouble = () => {
    addSerialLog("[BUZZER] beepDouble() warning!");
    playTone(300, 60);
    setTimeout(() => {
      playTone(300, 80);
    }, 100);
  };

  const triggerPauseSound = () => {
    addSerialLog("[BUZZER] pauseSound()");
    playTone(350, 80);
    setTimeout(() => {
      playTone(250, 60);
    }, 80);
  };

  const triggerPauseEscape = () => {
    addSerialLog("[BUZZER] pauseEscape()");
    playTone(250, 80);
    setTimeout(() => {
      playTone(350, 60);
    }, 80);
  };

  const allLEDOff = () => {
    setLedRed(false);
    setLedGreen(false);
    setLedYellow(false);
  };

  const changePomoState = (newState: 'INIT' | 'IDLE' | 'STUDY' | 'BREAK' | 'PAUSE') => {
    setPomoState(newState);
    setAlert50(false);
    setAlert20(false);
    setAlert3(false);
    allLEDOff();
    
    let statusStr = "TIME_SET";
    if (newState === 'STUDY') statusStr = "STUDYING";
    else if (newState === 'BREAK') statusStr = "BREAK TIME";
    else if (newState === 'PAUSE') statusStr = " PAUSED";
    
    addSerialLog(`[STATE] State -> ${newState} (${statusStr})`);
    
    if (newState === 'IDLE') setLedRed(true);
    else if (newState === 'STUDY') setLedGreen(true);
    else if (newState === 'BREAK') setLedYellow(true);
  };

  // Sync duration inputs to timer states in real-time when potentiometer is dragged
  useEffect(() => {
    if (type === 'pomodoro' && pomoState === 'IDLE') {
      const setMinutes = inputs['duration'] || 25;
      const studyDuration = setMinutes * 60;
      const breakDuration = setMinutes < 30 ? 300 : 600;
      
      setPomoTotalStudy(studyDuration);
      setPomoTotalBreak(breakDuration);
      setPomoTimeLeft(studyDuration);
    }
  }, [inputs['duration'], pomoState, type]);

  // Reset Simulator
  const handleReset = () => {
    setIsRunning(false);
    // Reset inputs
    const vals: Record<string, any> = {};
    project.simulation?.controls.forEach(c => {
      vals[c.key] = c.defaultValue;
    });
    setInputs(vals);
    
    if (type === 'yolo') {
      setFps(60);
      setDetectedCount(2);
    } else if (type === 'pid') {
      setCarX(150);
      setTrackX(150);
      setCarDirection(1);
      setSensorVals([120, 120, 950, 950, 120, 120]);
      setLastInterrupt('NONE');
      setPidError(Array(30).fill(0));
    } else if (type === 'sequence') {
      setLatchActive(false);
    } else if (type === 'pomodoro') {
      setPomoState('INIT');
      setPomoPreState('IDLE');
      const setMinutes = vals['duration'] || 25;
      const initialStudy = setMinutes * 60;
      setPomoTotalStudy(initialStudy);
      setPomoTotalBreak(setMinutes < 30 ? 300 : 600);
      setPomoTimeLeft(initialStudy);
      setPomoPauseRemain(300);
      setAlert50(false);
      setAlert20(false);
      setAlert3(false);
      allLEDOff();
    }
    addSerialLog('[SYS] Simulation state reset.');
  };

  // Simulator Loops
  useEffect(() => {
    if (!isRunning) return;

    let intervalId: any;

    if (type === 'yolo') {
      // Loop to simulate frame processing with tiny random noise
      intervalId = setInterval(() => {
        // Random slight change to FPS
        setFps(prev => Math.max(45, Math.min(64, prev + (Math.random() > 0.5 ? 1 : -1))));
        
        // Count detected objects based on confidence threshold.
        const confTh = inputs['conf'] || 50;
        const target = inputs['target'] || '종이컵';
        let count = 0;
        if (target === '종이컵') {
          if (confTh < 40) count = 3; // Simulated false positives
          else if (confTh <= 97) count = 1; // High precision target detection
          else count = 0;
        } else {
          if (confTh < 40) count = 2;
          else if (confTh <= 92) count = 1;
          else count = 0;
        }
        setDetectedCount(count);
      }, 300);
    } 
    
    else if (type === 'pid') {
      // Loop to calculate simulated 6-channel interrupt-driven line tracer trajectory
      let tick = 0;
      let localCarX = carX;
      intervalId = setInterval(() => {
        tick++;
        const sensor_cal = inputs['sensor_cal'] || 100;
        const int_gain = inputs['int_gain'] || 45;
        const pattern_weight = inputs['pattern_weight'] || 8;
        const speed = inputs['speed'] || 150;

        // Smooth wave-curved track line representing complex track bends
        const trackX = 150 + Math.sin(tick * 0.12) * 55;

        // Relative deviation
        const diff = localCarX - trackX;

        // Compute 6 IR sensors analog inputs based on Gaussian distribution from track center
        const s1 = Math.max(115, Math.round(1023 * Math.exp(-Math.pow((-diff - (-45)) / 14, 2))));
        const s2 = Math.max(115, Math.round(1023 * Math.exp(-Math.pow((-diff - (-27)) / 14, 2))));
        const s3 = Math.max(115, Math.round(1023 * Math.exp(-Math.pow((-diff - (-9)) / 14, 2))));
        const s4 = Math.max(115, Math.round(1023 * Math.exp(-Math.pow((-diff - (9)) / 14, 2))));
        const s5 = Math.max(115, Math.round(1023 * Math.exp(-Math.pow((-diff - (27)) / 14, 2))));
        const s6 = Math.max(115, Math.round(1023 * Math.exp(-Math.pow((-diff - (45)) / 14, 2))));

        setSensorVals([s1, s2, s3, s4, s5, s6]);

        // Continuous run-time automatic sensor calibration log every 1.5 seconds
        if (tick % 15 === 0) {
          const simulatedMin = 100 + Math.floor(Math.sin(tick * 0.05) * 15);
          const simulatedMax = 940 + Math.floor(Math.cos(tick * 0.05) * 25);
          const threshold = Math.floor((simulatedMin + simulatedMax) / 2 + (sensor_cal - 100) * 0.45);
          addSerialLog(`[CALIBRATION] Run-time continuous calibration updated: Min=${simulatedMin}, Max=${simulatedMax}, Baseline Threshold=${threshold}`);
        }

        let corrOffset = 0;
        let isrTriggered = false;

        // Deep curve alert triggering Interrupt Subroutine (ISR) on outermost S1, S6
        if (s1 > 540) {
          isrTriggered = true;
          setLastInterrupt('LEFT');
          corrOffset = - (int_gain / 10) * 4.5;
          if (tick % 3 === 0) {
            addSerialLog(`[INTERRUPT] S1 High-priority IR Interrupt (PIN D2) Fired! Sharp curve recovery triggered.`);
            playTone(850, 45);
          }
        } else if (s6 > 540) {
          isrTriggered = true;
          setLastInterrupt('RIGHT');
          corrOffset = (int_gain / 10) * 4.5;
          if (tick % 3 === 0) {
            addSerialLog(`[INTERRUPT] S6 High-priority IR Interrupt (PIN D3) Fired! Sharp curve recovery triggered.`);
            playTone(950, 45);
          }
        } else {
          setLastInterrupt('NONE');
        }

        // Standard pattern control steering for inner sensors
        let patternSteer = 0;
        if (!isrTriggered) {
          const leftForce = s3 * 1.0 + s2 * 1.8;
          const rightForce = s4 * 1.0 + s5 * 1.8;
          patternSteer = (rightForce - leftForce) / (pattern_weight * 70);
        }

        // Wobble perturbation factor representing driving dynamics
        const wobbleFactor = (speed / 150) * Math.sin(tick * 0.25) * 1.5;

        // Sum steer offsets
        let delta = patternSteer + corrOffset + wobbleFactor;
        if (isNaN(delta)) delta = 0;

        localCarX += delta;

        // Confine positions inside simulator box
        if (localCarX > 260) localCarX = 260;
        else if (localCarX < 40) localCarX = 40;

        setCarX(localCarX);
        setTrackX(trackX);

        // Record deviation for oscilloscope display (spiking on interrupts)
        const plotVal = isrTriggered 
          ? (diff + (diff > 0 ? 30 : -30)) 
          : diff;

        setPidError(prev => [...prev.slice(1), Number(plotVal.toFixed(1))]);
      }, 100);
    } 
    
    else if (type === 'pomodoro') {
      // Handle physical Arduino setup cold boot sequence on run
      if (pomoState === 'INIT') {
        allLEDOff();
        addSerialLog('[SYS] Booting Arduino Uno MCU...');
        const bootTimer = setTimeout(() => {
          changePomoState('IDLE');
          triggerStartSound();
        }, 1500);
        return () => clearTimeout(bootTimer);
      }

      // Live countdown loop (running every 1 second)
      intervalId = setInterval(() => {
        if (pomoState === 'IDLE') {
          setLedRed(true);
          setLedGreen(false);
          setLedYellow(false);

          const setMinutes = inputs['duration'] || 25;
          const studyDuration = setMinutes * 60;
          const breakDuration = setMinutes < 30 ? 300 : 600;

          setPomoTotalStudy(studyDuration);
          setPomoTotalBreak(breakDuration);
          setPomoTimeLeft(studyDuration);
        }
        
        else if (pomoState === 'STUDY') {
          setLedRed(false);
          setLedGreen(true);
          setLedYellow(false);

          setPomoTimeLeft(prev => {
            const nextVal = prev > 1 ? prev - 1 : 0;
            
            const mins = Math.floor(nextVal / 60);
            const secs = nextVal % 60;
            const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            addSerialLog(`State: STUDYING | Time: ${timeStr}`);

            // 50% Warning Rule
            const mark50 = Math.floor(pomoTotalStudy * 0.5);
            if (nextVal <= mark50 && prev > mark50 && !alert50) {
              triggerBeepShort();
              setAlert50(true);
            }

            // 20% Warning Rule
            const mark20 = Math.floor(pomoTotalStudy * 0.2);
            if (nextVal <= mark20 && prev > mark20 && !alert20) {
              triggerBeepDouble();
              setAlert20(true);
            }

            if (prev <= 1) {
              triggerEndSound();
              setPomoState('BREAK');
              setAlert50(false);
              setAlert20(false);
              setAlert3(false);
              setLedGreen(false);
              setLedYellow(true);
              return pomoTotalBreak;
            }
            return nextVal;
          });
        }
        
        else if (pomoState === 'BREAK') {
          setLedRed(false);
          setLedGreen(false);
          setLedYellow(true);

          setPomoTimeLeft(prev => {
            const nextVal = prev > 1 ? prev - 1 : 0;
            
            const mins = Math.floor(nextVal / 60);
            const secs = nextVal % 60;
            const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            addSerialLog(`State: BREAK TIME | Time: ${timeStr}`);

            // 3-minute remaining alarm in Break mode
            const mark3 = 3 * 60;
            if (nextVal <= mark3 && prev > mark3 && !alert3) {
              triggerBeepShort();
              setAlert3(true);
            }

            if (prev <= 1) {
              triggerStartSound();
              setPomoState('STUDY');
              setAlert50(false);
              setAlert20(false);
              setAlert3(false);
              setLedYellow(false);
              setLedGreen(true);
              return pomoTotalStudy;
            }
            return nextVal;
          });
        }
        
        else if (pomoState === 'PAUSE') {
          setLedYellow(v => !v); // Blinking yellow LED (LED status check)
          setLedRed(false);
          setLedGreen(false);

          setPomoPauseRemain(prev => {
            const nextVal = prev > 1 ? prev - 1 : 0;
            
            const mins = Math.floor(nextVal / 60);
            const secs = nextVal % 60;
            const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            addSerialLog(`State:  PAUSED | Hold: ${timeStr}`);

            if (prev <= 1) {
              // Auto resume after 5 mins limit timeout
              triggerPauseEscape();
              allLEDOff();
              setPomoState(pomoPreState);
              if (pomoPreState === 'STUDY') setLedGreen(true);
              else if (pomoPreState === 'BREAK') setLedYellow(true);
              return 300;
            }
            return nextVal;
          });
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, type, inputs, pomoState, pomoPreState, pomoTotalStudy, pomoTotalBreak, alert50, alert20, alert3]);

  // Draw Live PID Canvas chart
  useEffect(() => {
    if (type !== 'pid') return;
    const canvas = pidChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw grid columns
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    // Plot background threshold guide lines for INT PIN D2/D3
    ctx.strokeStyle = '#ef444450';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    // Top threshold (Positive drift)
    ctx.beginPath();
    ctx.moveTo(0, (canvas.height / 2) - (35 * 0.7));
    ctx.lineTo(canvas.width, (canvas.height / 2) - (35 * 0.7));
    ctx.stroke();
    // Bottom threshold (Negative drift)
    ctx.beginPath();
    ctx.moveTo(0, (canvas.height / 2) + (35 * 0.7));
    ctx.lineTo(canvas.width, (canvas.height / 2) + (35 * 0.7));
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot errors
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    
    const stepX = canvas.width / (pidError.length - 1);
    pidError.forEach((err, i) => {
      const x = i * stepX;
      // map error to canvas height (using 0.7 scale)
      const y = (canvas.height / 2) - (err * 0.7);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dot at current position
    if (pidError.length > 0) {
      const lastErr = pidError[pidError.length - 1];
      const isOver = Math.abs(lastErr) > 35;
      ctx.fillStyle = isOver ? '#ef4444' : '#0ea5e9';
      ctx.beginPath();
      ctx.arc(canvas.width, (canvas.height / 2) - (lastErr * 0.7), isOver ? 5 : 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [pidError, type]);

  // Helper selectors
  const gateOutputValue = () => {
    const a = inputs['sw_a'] || false;
    const b = inputs['sw_b'] || false;
    const gate = inputs['gate'] || "AND (직렬)";
    
    if (gate.startsWith("AND")) return a && b;
    if (gate.startsWith("OR")) return a || b;
    if (gate.startsWith("NAND")) return !(a && b);
    if (gate.startsWith("NOR")) return !(a || b);
    return false;
  };

  const getPomoTimeStr = () => {
    const mins = Math.floor(pomoTimeLeft / 60);
    const secs = pomoTimeLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getPauseTimeStr = () => {
    const mins = Math.floor(pomoPauseRemain / 60);
    const secs = pomoPauseRemain % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const clickBtnStart = () => {
    if (!isRunning) return;
    if (pomoState === 'IDLE') {
      triggerStartSound();
      changePomoState('STUDY');
    } else if (pomoState === 'PAUSE') {
      triggerPauseEscape();
      changePomoState('IDLE');
    }
  };

  const clickBtnPause = () => {
    if (!isRunning) return;
    if (pomoState === 'STUDY' || pomoState === 'BREAK') {
      triggerPauseSound();
      setPomoPreState(pomoState);
      setPomoState('PAUSE');
      setPomoPauseRemain(300); // 5 mins limit
      addSerialLog(`[BTN] BTN_PAUSE click: Saved current state (${pomoState}) and paused.`);
    } else if (pomoState === 'PAUSE') {
      triggerPauseEscape();
      setPomoState(pomoPreState);
      addSerialLog(`[BTN] BTN_PAUSE click: Resumed previous state (${pomoPreState}).`);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full border border-slate-800">
      
      {/* Console Header bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400 font-semibold tracking-wider ml-2.5">
            {project.simulation?.statusMessage || 'HARDWARE SIMULATOR'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'} shrink-0`} />
          <span className="text-[10px] font-mono font-bold text-slate-400">
            {isRunning ? 'RUNNING' : 'STOPPED'}
          </span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
        
        {/* Workspace panel 1: Visual Outputs inside Grid */}
        <div className="md:col-span-7 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 min-h-[280px]">
          <div className="flex-1 flex flex-col justify-center items-center relative">
            
            {/* 1. YOLO Visual Simulator */}
            {type === 'yolo' && (
              <div className="w-full h-full flex flex-col justify-between">
                {/* Simulated Screen Box */}
                <div className="relative w-full h-48 bg-slate-800/60 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,18,18,0)_95%,rgba(34,197,94,0.15)_95%),linear-gradient(to_right,rgba(18,18,18,0)_95%,rgba(34,197,94,0.15)_95%)] bg-[size:10%_10%] opacity-20 pointer-events-none" />
                  
                  {/* Subject Representation (Vector illustration) */}
                  <div className="flex gap-4">
                    <div className="relative p-6 bg-slate-700/50 border border-slate-600 rounded-xl flex flex-col items-center gap-1">
                      <div className="w-8 h-12 bg-blue-500/40 border border-blue-400/80 rounded-sm" />
                      <span className="text-[10px] font-mono text-slate-400">
                        {language === 'ko' ? '종이컵' : 'Paper Cup'}
                      </span>

                      {/* Bbox display */}
                      {isRunning && (inputs['target'] === '종이컵') && (inputs['conf'] <= 97) && (
                        <div className="absolute -inset-1 border-2 border-emerald-500 rounded-lg animate-pulse">
                          <span className="absolute -top-4 -left-0.5 bg-emerald-500 text-slate-950 text-[8px] font-mono font-black px-1 rounded-sm leading-none py-0.5">
                            PAPER_CUP:{(97.4 - (inputs['conf'] - 50) * 0.02).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative p-6 bg-slate-700/50 border border-slate-600 rounded-xl flex flex-col items-center gap-1">
                      <div className="w-8 h-12 bg-red-500/40 border border-red-400/80 rounded-xl" />
                      <span className="text-[10px] font-mono text-slate-400">
                        {language === 'ko' ? '캔' : 'Al Can'}
                      </span>

                      {/* Bbox display */}
                      {isRunning && (inputs['target'] === '캔') && (inputs['conf'] <= 92) && (
                        <div className="absolute -inset-1 border-2 border-emerald-500 rounded-lg animate-pulse">
                          <span className="absolute -top-4 -left-0.5 bg-emerald-500 text-slate-950 text-[8px] font-mono font-black px-1 rounded-sm leading-none py-0.5">
                            AL_CAN:{(92.1 - (inputs['conf'] - 50) * 0.05).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* High tech camera crosshairs */}
                  <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500">REC 1080P</div>
                  <div className="absolute bottom-3 left-3 text-[9px] font-mono text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-ping" />
                    LIVE MODEL FEED
                  </div>
                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-500">
                    DET_COUNT: {isRunning ? detectedCount : 0} Items
                  </div>
                </div>

                {/* Micro metrics panel */}
                <div className="grid grid-cols-3 gap-3 mt-4 text-center font-mono">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase block mb-0.5">MODEL STATE</span>
                    <span className="text-xs font-bold text-emerald-500">{isRunning ? 'ACTIVE-LOAD' : 'IDLE'}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase block mb-0.5">FRAME INGRESS</span>
                    <span className="text-xs font-bold text-blue-400">{isRunning ? `${fps} FPS` : '0 FPS'}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase block mb-0.5">WEIGHTS IN</span>
                    <span className="text-xs font-bold text-slate-300">
                      {inputs['weights'] ? inputs['weights'].split(' ')[0] : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PID Visual Simulator (Interrupt-driven Line Tracer Simulator) */}
            {type === 'pid' && (
              <div className="w-full h-full flex flex-col justify-between">
                {/* Visual Rover Track */}
                <div className="relative w-full h-32 bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] bg-[size:12px_12px] rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-center">
                  
                  {/* Road Track Line that shifts dynamically */}
                  <div 
                    className="absolute w-12 h-full bg-slate-900 border-x border-slate-800 flex items-center justify-center transition-all duration-100"
                    style={{ left: `${trackX - 24}px` }}
                  >
                    <div className="w-1.5 h-full bg-yellow-400/90" />
                  </div>

                  {/* Tracer car visual */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-14 h-18 bg-blue-700 border-2 border-blue-400 rounded-xl shadow-xl flex flex-col justify-between items-center z-10 p-1.5 transition-all duration-100"
                    style={{ left: `${carX - 28}px` }}
                  >
                    {/* 4 Wheels */}
                    <div className="absolute -left-1.5 top-2.5 w-1.5 h-4.5 bg-slate-950 rounded-sm border-[1px] border-slate-800" />
                    <div className="absolute -right-1.5 top-2.5 w-1.5 h-4.5 bg-slate-950 rounded-sm border-[1px] border-slate-800" />
                    <div className="absolute -left-1.5 bottom-2.5 w-1.5 h-4.5 bg-slate-950 rounded-sm border-[1px] border-slate-800" />
                    <div className="absolute -right-1.5 bottom-2.5 w-1.5 h-4.5 bg-slate-950 rounded-sm border-[1px] border-slate-800" />

                    {/* Rover micro label */}
                    <span className="text-[6.5px] font-mono font-bold text-blue-200 uppercase select-none mt-0.5">ROVER</span>
                    <span className="text-[7px] font-mono leading-none bg-slate-950/90 px-1 py-0.5 text-blue-400 rounded border border-slate-800 font-extrabold select-none">MCU</span>

                    {/* Bumper with 6 IR Sensor LEDs */}
                    <div className="flex justify-between w-full px-0.5 gap-[2px] mt-1.5">
                      {sensorVals.map((val, idx) => (
                        <div 
                          key={idx} 
                          className={`w-1.5 h-1.5 rounded-full border-[1px] flex items-center justify-center transition-all duration-150 ${
                            val > 540 
                              ? 'bg-red-500 border-red-300 shadow shadow-red-500 animate-pulse' 
                              : 'bg-slate-850 border-slate-700'
                          }`}
                          title={`S${idx + 1}: ${val}`}
                        >
                          <span className="text-[3px] font-sans font-bold text-white"></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Overlay: Active Interrupt Banners */}
                  <div className="absolute top-2.5 right-3.5 flex items-center gap-1.5">
                    {lastInterrupt === 'LEFT' ? (
                      <span className="px-2 py-0.5 bg-red-950/80 border border-red-500 text-red-400 text-[8px] font-mono font-black rounded-lg animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                        ISR ACTIVE: PIN D2 (LEFT CURVE)
                      </span>
                    ) : lastInterrupt === 'RIGHT' ? (
                      <span className="px-2 py-0.5 bg-yellow-950/80 border border-yellow-500 text-yellow-400 text-[8px] font-mono font-black rounded-lg animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                        ISR ACTIVE: PIN D3 (RIGHT CURVE)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 text-slate-500 text-[8px] font-mono rounded-lg">
                        POLLING ACTIVE (INT READY)
                      </span>
                    )}
                  </div>

                  {/* Left watermark labels */}
                  <div className="absolute top-2.5 left-3.5 flex flex-col">
                    <span className="text-[8px] font-mono text-slate-500 tracking-wider">6-CH IR ARRAY</span>
                    <span className="text-[6.5px] font-mono text-slate-600">CALIBRATING: CONT_ON</span>
                  </div>

                  {/* Limits boundary indicators */}
                  <div className="absolute inset-x-0 bottom-2.5 flex justify-between px-3 text-[8.5px] font-mono text-slate-650">
                    <span>LEFT OVERFLOW</span>
                    <span className="text-slate-500 opacity-60">TRACK BASE SINE</span>
                    <span>RIGHT OVERFLOW</span>
                  </div>
                </div>

                {/* Live numerical sensor values */}
                <div className="grid grid-cols-6 gap-2 my-3 text-center">
                  {sensorVals.map((val, idx) => (
                    <div key={idx} className="bg-slate-950/40 p-1.5 rounded-lg border border-slate-900 flex flex-col">
                      <span className="text-[7px] font-mono text-slate-500">S{idx + 1}{idx === 0 || idx === 5 ? ' (INT)' : ''}</span>
                      <span className={`text-[10px] font-mono font-bold mt-0.5 ${val > 540 ? 'text-red-400' : 'text-slate-450'}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Live canvas plotting error values */}
                <div className="mt-2 flex flex-col">
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mb-1.5">
                    <Activity size={10} className="text-blue-500 animate-pulse" />
                    REAL-TIME OSCILLOSCOPE (6-CH DEVIATION & HARDWARE ISR TRIPPERS)
                  </span>
                  <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden">
                    <canvas 
                      ref={pidChartRef}
                      width={320} 
                      height={90} 
                      className="w-full h-[80px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Sequence logic simulator */}
            {type === 'sequence' && (
              <div className="w-full h-full flex flex-col justify-between">
                {/* Electrical wiring visual panel */}
                <div className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[180px]">
                  
                  {/* Schematic rail lines */}
                  <div className="flex flex-col gap-5 w-full pr-2">
                    
                    {/* Electrical Rail L1 */}
                    <div className="flex items-center gap-2 justify-between w-full">
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <span className="text-amber-500 font-bold">[24V L1]</span>
                        <div className="w-8 h-0.5 bg-amber-500" />
                      </div>

                      {/* Connection components */}
                      <div className="flex-1 flex justify-around items-center px-4 relative">
                        <div className="absolute inset-y-0 left-0 right-0 h-0.5 bg-slate-700 pointer-events-none" />

                        {/* Switch A block */}
                        <div className="flex flex-col items-center">
                          <span className={`w-8 h-4 border border-dashed rounded-sm my-1 relative ${inputs['sw_a'] ? 'bg-amber-400/30 border-amber-400' : 'bg-slate-800 border-slate-600'}`}>
                            <span className={`absolute top-0 left-1 w-2.5 h-0.5 bg-white transition-transform ${inputs['sw_a'] ? 'rotate-0 origin-left mt-1.5' : '-rotate-45 origin-left'}`} />
                          </span>
                          <span className="text-[8px] font-mono text-slate-500">SWITCH A</span>
                        </div>

                        {/* Switch B block */}
                        <div className="flex flex-col items-center">
                          <span className={`w-8 h-4 border border-dashed rounded-sm my-1 relative ${inputs['sw_b'] ? 'bg-amber-400/30 border-amber-400' : 'bg-slate-800 border-slate-600'}`}>
                            <span className={`absolute top-0 left-1 w-2.5 h-0.5 bg-white transition-transform ${inputs['sw_b'] ? 'rotate-0 origin-left mt-1.5' : '-rotate-45 origin-left'}`} />
                          </span>
                          <span className="text-[8px] font-mono text-slate-500">SWITCH B</span>
                        </div>
                      </div>

                      {/* Output Coil */}
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <div className="w-8 h-0.5 bg-slate-700" />
                        <div className={`p-1.5 border rounded-lg flex items-center justify-center transition-all ${
                          gateOutputValue() 
                            ? 'bg-blue-500/20 text-blue-400 border-blue-400 animate-pulse shadow-md shadow-blue-500/10' 
                            : 'bg-slate-900 text-slate-500 border-slate-700'
                        }`}>
                          <Cpu size={14} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 font-mono ml-1">COIL_OUT</span>
                      </div>
                    </div>

                    {/* Self lock sub latch track if SW_A or SW_B active */}
                    <div className="flex items-center justify-between w-full opacity-60">
                      <div className="w-[84px] h-3 border-l-2 border-b-2 border-slate-700 rounded-bl-lg" />
                      <div className="flex-1 border-b-2 border-slate-700 flex justify-center items-center relative">
                        <div className={`px-2.5 py-0.5 rounded border text-[8px] font-mono ${gateOutputValue() ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400' : 'bg-slate-900 text-slate-600 border-slate-700'}`}>
                          LATCH STATE: {gateOutputValue() ? 'LOCKED' : 'RESET'}
                        </div>
                      </div>
                      <div className="w-[94px] h-3 border-r-2 border-b-2 border-slate-700 rounded-br-lg" />
                    </div>

                  </div>
                </div>

                {/* Gate Truth card */}
                <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-left">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Info size={12} />
                    <span>KS/IEC 시퀀스 논리 분석</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="bg-slate-950 p-1.5 rounded-md text-slate-400">
                      SW-A Status: <strong className={inputs['sw_a'] ? 'text-amber-400' : 'text-slate-500'}>{inputs['sw_a'] ? '1' : '0'}</strong>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded-md text-slate-400">
                      SW-B Status: <strong className={inputs['sw_b'] ? 'text-amber-400' : 'text-slate-500'}>{inputs['sw_b'] ? '1' : '0'}</strong>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded-md text-slate-400">
                      Logic Gate: <strong className="text-blue-400">{inputs['gate']?.split(' ')[0]}</strong>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded-md text-slate-400">
                      LED Coil: <strong className={gateOutputValue() ? 'text-green-400' : 'text-red-500'}>{gateOutputValue() ? 'HIGH (1)' : 'LOW (0)'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Pomodoro Simulator */}
            {type === 'pomodoro' && (
              <div className="w-full h-full flex flex-col justify-between gap-4">
                
                {/* Physical I2C LCD 1602 Display mockup */}
                <div className="relative w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                  <div className="w-full max-w-sm bg-slate-950 border-4 border-slate-800 p-2.5 rounded-xl shadow-inner relative">
                    
                    {/* Brass screws on 4 corners */}
                    <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-yellow-600/60 rounded-full border border-yellow-700/80 flex items-center justify-center"><span className="w-1 h-0.5 bg-zinc-400 rotate-45" /></div>
                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-yellow-600/60 rounded-full border border-yellow-700/80 flex items-center justify-center"><span className="w-1 h-0.5 bg-zinc-400 -rotate-45" /></div>
                    <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 bg-yellow-600/60 rounded-full border border-yellow-700/80 flex items-center justify-center"><span className="w-1 h-0.5 bg-zinc-400 -rotate-45" /></div>
                    <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 bg-yellow-600/60 rounded-full border border-yellow-700/80 flex items-center justify-center"><span className="w-1 h-0.5 bg-zinc-400 rotate-45" /></div>

                    {/* LCD Screen glass bezel */}
                    <div className={`transition-all duration-300 p-3 rounded-lg font-mono flex flex-col border shadow-inner ${
                      isRunning 
                        ? 'bg-cyan-500/90 text-cyan-950 border-cyan-400 shadow-cyan-400/25' 
                        : 'bg-slate-950 text-slate-800 border-slate-900 shadow-transparent'
                    }`}>
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                      
                      {/* LCD Line 0 */}
                      <div className={`text-center text-xs font-black tracking-widest uppercase mb-1.5 transition-opacity h-4 flex items-center justify-center ${
                        isRunning ? 'opacity-90' : 'opacity-25'
                      }`}>
                        {!isRunning && '  [ POWER OFF ]  '}
                        {isRunning && pomoState === 'INIT' && ' POMODORO TIMER '}
                        {isRunning && pomoState === 'IDLE' && '    TIME_SET    '}
                        {isRunning && pomoState === 'STUDY' && '   STUDYING...  '}
                        {isRunning && pomoState === 'BREAK' && '   BREAK TIME!  '}
                        {isRunning && pomoState === 'PAUSE' && '     PAUSED     '}
                      </div>
                      
                      {/* LCD Line 1 */}
                      <div className={`text-center text-base font-black tracking-widest uppercase h-7 flex items-center justify-center transition-opacity ${
                        isRunning ? 'opacity-100' : 'opacity-15'
                      }`}>
                        {!isRunning && 'I2C ADDR: 0x27  '}
                        {isRunning && pomoState === 'INIT' && '  Initializing  '}
                        {isRunning && (pomoState === 'IDLE' || pomoState === 'STUDY' || pomoState === 'BREAK') && (
                          <span className="flex items-center gap-1.5 text-lg">
                            <span className="animate-pulse">🕒</span> Time: {getPomoTimeStr()}
                          </span>
                        )}
                        {isRunning && pomoState === 'PAUSE' && (
                          <span className="flex items-center gap-1.5 text-lg animate-pulse">
                            🚨 Hold: {getPauseTimeStr()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-3 text-[8px] font-mono text-slate-700 font-bold uppercase tracking-wider">I2C LCD1602 HD44780</span>
                </div>

                {/* Virtual Embedded Breadboard components wrapper */}
                <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
                  
                  {/* Row 1: Pin mapping status / visual microcontroller indicators */}
                  <div className="flex justify-between items-start gap-4">
                    
                    {/* LEDs Circuit components mockup */}
                    <div className="flex flex-col text-left gap-1.5">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">GPIO Out Pin Status</span>
                      <div className="flex gap-4 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl relative">
                        
                        {/* RED LED (IDLE) */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative">
                            <div className={`w-5 h-5 rounded-full border transition-all duration-250 ${
                              isRunning && ledRed
                                ? 'bg-red-500 border-red-300 shadow-md shadow-red-500/80'
                                : 'bg-red-950/40 border-red-900/40'
                            }`} />
                            {isRunning && ledRed && (
                              <span className="absolute inset-0 bg-red-400 rounded-full filter blur-sm opacity-50 animate-pulse pointer-events-none" />
                            )}
                          </div>
                          <span className="text-[8px] font-mono text-slate-400 font-bold">RED (D9)</span>
                        </div>

                        {/* GREEN LED (STUDY) */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative">
                            <div className={`w-5 h-5 rounded-full border transition-all duration-250 ${
                              isRunning && ledGreen
                                ? 'bg-emerald-500 border-emerald-300 shadow-md shadow-emerald-500/80'
                                : 'bg-emerald-950/40 border-emerald-900/40'
                            }`} />
                          </div>
                          <span className="text-[8px] font-mono text-slate-400 font-bold">GRN (D10)</span>
                        </div>

                        {/* YELLOW LED (BREAK / PAUSE) */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative">
                            <div className={`w-5 h-5 rounded-full border transition-all duration-250 ${
                              isRunning && ledYellow
                                ? 'bg-amber-400 border-amber-200 shadow-md shadow-amber-400/80'
                                : 'bg-amber-950/40 border-amber-900/40'
                            }`} />
                          </div>
                          <span className="text-[8px] font-mono text-slate-400 font-bold">YLW (D11)</span>
                        </div>

                      </div>
                    </div>

                    {/* Piezo Buzzer component mockup */}
                    <div className="flex flex-col text-left gap-1.5 flex-1 max-w-[140px]">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">PIEZO BUZZER (D6)</span>
                      <div className="p-2 py-2 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center gap-2 h-[46px] justify-between overflow-hidden relative">
                        <div className="flex items-center gap-1.5">
                          {/* Circular buzzer body */}
                          <div className="relative w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 flex items-center justify-center border border-slate-900">
                              <span className="w-1 h-1 rounded-full bg-zinc-600" />
                            </span>
                            {/* Animated sound ripple */}
                            {isRunning && buzzerActive && (
                              <span className="absolute -inset-1.5 border border-yellow-400/60 rounded-full animate-ping pointer-events-none" />
                            )}
                          </div>
                          <div className="flex flex-col font-mono text-left">
                            <span className="text-[9px] font-bold text-slate-300">BUZZER</span>
                            <span className="text-[7px] text-slate-500">Pin 6 PWM</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Row 2: Physical clickable Inputs */}
                  <div className="flex flex-col text-left gap-1.5">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">TACTILE INPUT BUTTONS</span>
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Button GP_PIN 2: START */}
                      <button
                        onClick={clickBtnStart}
                        disabled={!isRunning}
                        className={`flex items-center justify-between p-3 rounded-xl border font-mono transition-all select-none text-left relative overflow-hidden ${
                          isRunning
                            ? 'bg-slate-950 hover:bg-slate-900 border-red-500/30 text-slate-100 hover:border-red-500/60 cursor-pointer active:scale-98 active:bg-slate-900/80'
                            : 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-200">BTN_START</span>
                          <span className="text-[8px] text-red-400 font-bold uppercase">Pin 2 (Pull-up)</span>
                        </div>
                        {/* Red round tactile switch */}
                        <div className="w-6 h-6 rounded-full flex items-center justify-center border border-red-600 bg-red-500 shadow-md shrink-0 active:scale-90 active:bg-red-600 hover:translate-y-px transition-all">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-60" />
                        </div>
                      </button>

                      {/* Button GP_PIN 3: PAUSE */}
                      <button
                        onClick={clickBtnPause}
                        disabled={!isRunning}
                        className={`flex items-center justify-between p-3 rounded-xl border font-mono transition-all select-none text-left relative overflow-hidden ${
                          isRunning
                            ? 'bg-slate-950 hover:bg-slate-900 border-yellow-500/30 text-slate-100 hover:border-yellow-500/60 cursor-pointer active:scale-98 active:bg-slate-900/80'
                            : 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-200">BTN_PAUSE</span>
                          <span className="text-[8px] text-yellow-500 font-bold uppercase font-black">Pin 3 (Pull-up)</span>
                        </div>
                        {/* Yellow cup tactile indicator */}
                        <div className="w-6 h-6 rounded-full flex items-center justify-center border border-yellow-600 bg-yellow-500 shadow-md shrink-0 active:scale-90 active:bg-yellow-600 hover:translate-y-px transition-all">
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 opacity-60" />
                        </div>
                      </button>

                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Quick interactive operation bar */}
          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all text-slate-950 cursor-pointer ${
                isRunning 
                  ? 'bg-red-400 hover:bg-red-500 shadow-red-500/10' 
                  : 'bg-emerald-400 hover:bg-emerald-500 shadow-emerald-500/10'
              }`}
              id="sim-run-button"
            >
              {isRunning ? <Pause size={12} /> : <Play size={12} />}
              {isRunning 
                ? (language === 'ko' ? '시뮬레이션 중지' : 'Stop Simulation') 
                : (language === 'ko' ? '시뮬레이션 작동' : 'Start Simulation')
              }
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700/60 rounded-xl active:scale-95 transition-all cursor-pointer"
              id="sim-reset-button"
            >
              <RotateCcw size={12} />
              {language === 'ko' ? '초기화' : 'Reset'}
            </button>
          </div>
        </div>

        {/* Workspace panel 2: Controller & Serial Logs inside Grid */}
        <div className="md:col-span-5 p-6 flex flex-col justify-between bg-slate-950">
          
          {/* Controls Box */}
          <div className="flex-1 flex flex-col gap-5 text-left mb-6">
            <span className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>CONTROLS</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase">INPUT PINMAPPING</span>
            </span>
            
            {/* Controls iteration */}
            <div className="flex flex-col gap-4">
              {project.simulation?.controls.map((ctrl) => (
                <div key={ctrl.key} className="flex flex-col gap-1.5" id={`sim-ctrl-${ctrl.key}`}>
                  <label className="text-[11px] font-mono font-bold text-slate-300 flex items-center justify-between">
                    <span>{ctrl.label}</span>
                    <span className="text-slate-500">({ctrl.key})</span>
                  </label>

                  {/* Range Slider control */}
                  {ctrl.type === 'slider' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={ctrl.min}
                        max={ctrl.max}
                        value={inputs[ctrl.key] || ctrl.defaultValue}
                        onChange={(e) => handleControlChange(ctrl.key, Number(e.target.value))}
                        className="flex-1 accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-blue-400 w-8 text-right shrink-0">
                        {inputs[ctrl.key]}
                      </span>
                    </div>
                  )}

                  {/* Switch Toggle control */}
                  {ctrl.type === 'switch' && (
                    <button
                      onClick={() => handleControlChange(ctrl.key, !inputs[ctrl.key])}
                      className={`w-12 h-6 rounded-full p-0.5 transition-colors focus:outline-none flex ${
                        inputs[ctrl.key] ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
                    </button>
                  )}

                  {/* Select Options control */}
                  {ctrl.type === 'select' && (
                    <select
                      value={inputs[ctrl.key] || ctrl.defaultValue}
                      onChange={(e) => handleControlChange(ctrl.key, e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500 w-full"
                    >
                      {ctrl.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-slate-300">
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Serial Terminal Box */}
          <div className="font-mono text-[10px] text-left flex-1 border-t border-slate-800 pt-4 flex flex-col justify-end">
            <span className="text-[9px] text-slate-500 tracking-wider mb-2 uppercase select-none">UART SERIAL CONSOLE MON</span>
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl h-28 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-slate-800">
              {serialLogs.map((log, i) => {
                let colorClass = 'text-slate-400';
                if (log?.includes('[BUZZER]')) colorClass = 'text-yellow-400';
                if (log?.includes('[SYS]')) colorClass = 'text-blue-400';
                if (log?.includes('[TIMER]')) colorClass = 'text-cyan-400';
                if (log?.includes('[PARAM]')) colorClass = 'text-emerald-400';
                return (
                  <div key={i} className={`leading-relaxed leading-none whitespace-pre-wrap ${colorClass}`}>
                    {log}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
