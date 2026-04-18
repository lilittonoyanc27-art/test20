import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Book, HelpCircle, Trophy, RotateCcw, ChevronRight, CheckCircle2, XCircle, Info, Star, Timer, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

// --- Types ---

interface TimeTask {
  hours: number;
  minutes: number;
  options: string[];
  answer: string;
  translation: string;
}

// --- Data Generation ---

const generateTimeTasks = (): TimeTask[] => {
  const times = [
    { h: 1, m: 0, a: "Es la una", t: "Ժամը մեկն է" },
    { h: 2, m: 0, a: "Son las dos", t: "Ժամը երկուսն է" },
    { h: 3, m: 15, a: "Son las tres y cuarto", t: "Երեքն անց տասնհինգ (երեք ու քառորդ)" },
    { h: 4, m: 30, a: "Son las cuatro y media", t: "Չորսն անց կես (չորս ու կես)" },
    { h: 5, m: 45, a: "Son las seis menos cuarto", t: "Վեցից տասնհինգ պակաս (քառորդ տարբերակ)" },
    { h: 8, m: 10, a: "Son las ocho y diez", t: "Ութն անց տաս" },
    { h: 10, m: 20, a: "Son las diez y veinte", t: "Տասն անց քսան" },
    { h: 1, m: 30, a: "Es la una y media", t: "Մեկն անց կես" },
    { h: 12, m: 0, a: "Son las doce", t: "Ժամը տասներկուսն է" },
    { h: 7, m: 15, a: "Son las siete y cuarto", t: "Յոթն անց տասնհինգ" },
    { h: 9, m: 40, a: "Son las diez menos veinte", t: "Տասից քսան պակաս" },
    { h: 11, m: 50, a: "Son las doce menos diez", t: "Տասներկուսից տաս պակաս" },
    { h: 6, m: 0, a: "Son las seis", t: "Ժամը վեցն է" },
    { h: 2, m: 45, a: "Son las tres menos cuarto", t: "Երեքից տասնհինգ պակաս" },
    { h: 5, m: 25, a: "Son las cinco y veinticinco", t: "Հինգն անց քսանհինգ" },
    { h: 8, m: 35, a: "Son las nueve menos veinticinco", t: "Իննից քսանհինգ պակաս" },
    { h: 1, m: 15, a: "Es la una y cuarto", t: "Մեկն անց տասնհինգ" },
    { h: 12, m: 30, a: "Son las doce y media", t: "Տասներկուսն անց կես" },
    { h: 4, m: 10, a: "Son las cuatro y diez", t: "Չորսն անց տաս" },
    { h: 10, m: 0, a: "Son las diez", t: "Ժամը տասն է" },
  ];

  return times.map(time => {
    const wrongAnswers = times
      .filter(t => t.a !== time.a)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(t => t.a);
    
    return {
      hours: time.h,
      minutes: time.m,
      answer: time.a,
      translation: time.t,
      options: [time.a, ...wrongAnswers].sort(() => Math.random() - 0.5)
    };
  });
};

// --- Subcomponents ---

const AnalogClock = ({ hours, minutes }: { hours: number, minutes: number }) => {
  const hDeg = (hours % 12) * 30 + (minutes / 60) * 30;
  const mDeg = minutes * 6;

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-slate-900 border-8 border-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.2)] flex items-center justify-center transform group-hover:rotate-y-12 transition-transform duration-500" style={{ perspective: '1000px' }}>
      {/* Numbers */}
      {[12, 3, 6, 9].map((num, i) => (
        <span 
          key={num} 
          className="absolute font-black text-blue-500/50 text-xl"
          style={{ 
            top: i === 0 ? '10%' : i === 2 ? '80%' : '44%',
            left: i === 1 ? '85%' : i === 3 ? '10%' : '46%'
          }}
        >
          {num}
        </span>
      ))}
      
      {/* Hour Hand */}
      <motion.div 
        animate={{ rotate: hDeg }}
        className="absolute w-1.5 h-16 md:h-20 bg-white rounded-full origin-bottom"
        style={{ bottom: '50%' }}
      />
      
      {/* Minute Hand */}
      <motion.div 
        animate={{ rotate: mDeg }}
        className="absolute w-1 h-20 md:h-28 bg-sky-400 rounded-full origin-bottom"
        style={{ bottom: '50%' }}
      />
      
      {/* Center Dot */}
      <div className="absolute w-4 h-4 bg-blue-600 rounded-full z-10 border-2 border-white" />
    </div>
  );
};

const TimeRules = () => (
  <div className="bg-slate-900/80 border border-blue-500/20 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-xl max-w-2xl w-full">
    <div className="flex items-center gap-4 text-blue-400">
      <Book size={32} />
      <h2 className="text-3xl font-black uppercase tracking-tighter italic">Իսպաներենի Ժամերի Կանոնները</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      <div className="space-y-4">
        <h3 className="font-black text-sky-400 uppercase tracking-widest text-xs">Հիմնական ձևերը</h3>
        <ul className="space-y-2 text-slate-300">
          <li><span className="text-white font-bold">Es la una:</span> Ժամը 1-ն է (եզակի)</li>
          <li><span className="text-white font-bold">Son las...:</span> Ժամը 2-ից 12-ը (հոգնակի)</li>
          <li><span className="text-white font-bold">y cuarto:</span> և քառորդ (15 րոպե)</li>
          <li><span className="text-white font-bold">y media:</span> և կես (30 րոպե)</li>
        </ul>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-black text-sky-400 uppercase tracking-widest text-xs">Մինուսային ձևեր (30-ից հետո)</h3>
        <ul className="space-y-2 text-slate-300">
          <li>30 րոպեից հետո օգտագործում ենք հաջորդ ժամը և հանում րոպեները:</li>
          <li>Օրինակ՝ 12:45-ը դառնում է <span className="text-white">una menos cuarto</span> (մեկից քառորդ պակաս):</li>
          <li><span className="text-white font-bold">menos diez:</span> տաս պակաս</li>
        </ul>
      </div>
    </div>

    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-4 items-center">
      <Info className="text-blue-400 shrink-0" />
      <p className="text-xs text-slate-400 italic">
        Հիշիր՝ Իսպաներենում ժամերը միշտ իգական սեռի են, որովհետև «hora» բառը իգական է:
      </p>
    </div>
  </div>
);

// --- Main App ---

export default function SpanishTimeMaster() {
  const [gameState, setGameState] = useState<'intro' | 'rules' | 'test' | 'end'>('intro');
  const [tasks, setTasks] = useState<TimeTask[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startTest = () => {
    setTasks(generateTimeTasks());
    setCurrentIdx(0);
    setScore(0);
    setGameState('test');
  };

  const handleAnswer = (option: string) => {
    const isCorrect = option === tasks[currentIdx].answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) setScore(s => s + 5);

    setTimeout(() => {
      setFeedback(null);
      if (currentIdx + 1 < tasks.length) {
        setCurrentIdx(i => i + 1);
      } else {
        setGameState('end');
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
      }
    }, 1500);
  };

  const reset = () => {
    setGameState('intro');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 selection:bg-blue-500/30 overflow-x-hidden">
      <div className="max-w-4xl mx-auto min-h-[90vh] flex flex-col items-center justify-center space-y-12">
        
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-12 w-full"
            >
              <div className="relative inline-block">
                 <Clock size={160} className="text-blue-600 animate-pulse" />
                 <Star className="absolute -top-4 -right-4 text-sky-400 animate-spin" size={40} />
              </div>
              
              <div className="space-y-4">
                 <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">
                    ¿Qué <span className="text-blue-600">hora</span> es?
                 </h1>
                 <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm">Ժամերի Մագիստրոս: 20 Փորձություն</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                 <button 
                   onClick={() => setGameState('rules')}
                   className="w-full md:w-auto px-12 py-6 bg-slate-900 border-2 border-slate-800 rounded-full font-black text-xl uppercase tracking-widest hover:border-blue-500 transition-all flex items-center justify-center gap-3"
                 >
                   <Book size={24} className="text-blue-500" />
                   Կանոններ
                 </button>
                 <button 
                   onClick={startTest}
                   className="w-full md:w-auto px-16 py-8 bg-blue-600 rounded-full font-black text-3xl uppercase tracking-widest hover:bg-blue-500 transition-all hover:scale-105 shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-4"
                 >
                   <RotateCcw size={32} />
                   Սկսել
                 </button>
              </div>
            </motion.div>
          )}

          {gameState === 'rules' && (
            <motion.div 
              key="rules"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center space-y-8 w-full"
            >
              <TimeRules />
              <button 
                onClick={startTest}
                className="px-12 py-6 bg-blue-600 rounded-full font-black text-xl uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40"
              >
                Պարզ է, Սկսենք!
              </button>
            </motion.div>
          )}

          {gameState === 'test' && tasks[currentIdx] && (
            <motion.div 
              key="test"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full flex flex-col items-center space-y-12"
            >
              {/* Progress Header */}
              <div className="w-full max-w-2xl flex justify-between items-end mb-4 px-4">
                 <div className="flex items-center gap-2">
                    <Timer size={16} className="text-sky-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Հարց {currentIdx + 1} / 20</span>
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Միավորներ</span>
                    <span className="text-2xl font-black italic text-blue-400 leading-none">{score}</span>
                 </div>
              </div>

              {/* Clock and Question */}
              <div className="group w-full max-w-4xl bg-slate-900/50 border border-slate-800 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 md:gap-24 shadow-2xl relative overflow-hidden backdrop-blur-md">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                 
                 <div className="flex-shrink-0">
                    <AnalogClock hours={tasks[currentIdx].hours} minutes={tasks[currentIdx].minutes} />
                 </div>

                 <div className="flex-1 space-y-12">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-blue-500">
                          <HelpCircle size={20} />
                          <span className="text-xs font-black uppercase tracking-widest">Ընտրիր ճիշտ պատասխանը</span>
                       </div>
                       <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-tight text-white uppercase translate-z-10 underline decoration-blue-500/30 underline-offset-8">
                         Ի՞նչ ժամ է
                       </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       {tasks[currentIdx].options.map(opt => (
                         <button 
                           key={opt}
                           onClick={() => handleAnswer(opt)}
                           disabled={!!feedback}
                           className={`p-6 rounded-2xl font-black text-2xl uppercase tracking-tighter border-4 transition-all text-left flex justify-between items-center ${
                             feedback === 'correct' && opt === tasks[currentIdx].answer ? 'bg-emerald-500 border-emerald-400 text-white translate-x-2' :
                             feedback === 'wrong' && opt !== tasks[currentIdx].answer ? 'opacity-30 border-slate-800' :
                             feedback === 'wrong' && opt === tasks[currentIdx].answer ? 'border-emerald-500 text-emerald-500 font-black' :
                             'bg-slate-950 border-slate-800 hover:border-blue-500 hover:bg-slate-900 group/btn'
                           }`}
                         >
                           {opt}
                           <ChevronRight className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Feedback Overlay */}
                 <AnimatePresence>
                   {feedback && (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className={`absolute inset-0 flex flex-col items-center justify-center p-12 backdrop-blur-lg z-20 ${feedback === 'correct' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}
                     >
                        {feedback === 'correct' ? <CheckCircle2 size={120} className="text-emerald-500 mb-6 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" /> : <XCircle size={120} className="text-rose-500 mb-6 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]" />}
                        <div className={`text-6xl font-black uppercase italic tracking-tighter ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {feedback === 'correct' ? 'Ճիշտ է!' : 'Սխալ է!'}
                        </div>
                        <p className="mt-4 text-xl font-bold italic text-white/70">({tasks[currentIdx].translation})</p>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              {/* Small Tip */}
              <div className="flex items-center gap-3 text-slate-500 italic max-w-sm text-center">
                 <Sparkles size={16} className="text-blue-600 shrink-0" />
                 <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Իսպաներենում ժամերը միշտ սկսվում են հոդով՝ <span className="text-blue-500">LA</span> (ժամը 1) կամ <span className="text-blue-500">LAS</span> (մնացած բոլոր ժամերը)։
                 </p>
              </div>
            </motion.div>
          )}

          {gameState === 'end' && (
            <motion.div 
              key="end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12"
            >
              <div className="relative inline-block">
                <Trophy size={200} className="text-yellow-400 drop-shadow-[0_0_40px_rgba(250,204,21,0.4)] animate-bounce" />
                <Star className="absolute top-0 left-0 text-white animate-pulse" />
              </div>
              
              <div className="space-y-4">
                 <h1 className="text-7xl font-black uppercase italic tracking-tighter">Ավարտ!</h1>
                 <p className="text-3xl font-black italic text-sky-400">Քո միավորները: {score} / 100</p>
                 <div className="flex justify-center gap-2 mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < (score / 20) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-800'} />
                    ))}
                 </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={reset}
                  className="px-12 py-6 bg-slate-900 border-2 border-slate-800 rounded-full font-black text-xl uppercase tracking-widest hover:border-blue-500 transition-all text-white flex items-center gap-3"
                >
                  <LayoutTemplate size={24} />
                  Մենյու
                </button>
                <button 
                  onClick={startTest}
                  className="px-12 py-6 bg-blue-600 rounded-full font-black text-xl uppercase tracking-widest hover:bg-blue-500 transition-all text-white shadow-xl shadow-blue-900/40"
                >
                  Նորից
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

const LayoutTemplate = ({ size }: { size: number }) => <Clock size={size} />;
