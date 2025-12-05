import React, { useState, useRef, useEffect } from 'react';
import { Flame, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { useFitManager } from '../../context/FitManagerContext';
import { useNavigate } from 'react-router-dom';
import { getLeagueInfo, LEAGUES, getInactivityStatus, PENALTY_XP } from '../../utils/gamification';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

export default function StudentHomePage() {
  const { user, getStudentWorkouts, checkInactivity } = useFitManager();
  const navigate = useNavigate();
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);

  // Check Inactivity on Mount
  const hasCheckedInactivity = useRef(false);

  useEffect(() => {
    if (user?.id && !hasCheckedInactivity.current) {
      hasCheckedInactivity.current = true;
      const wasPenalized = checkInactivity(user.id);
      if (wasPenalized) {
        setShowPenaltyModal(true);
      }
    }
  }, [user?.id, checkInactivity]);
  
  // Get Workouts
  const workouts = getStudentWorkouts(user?.id) || [];
  const activeWorkouts = Array.isArray(workouts) 
    ? workouts
        .filter(w => !w.completed)
        .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
    : [];
    
  const nextWorkout = activeWorkouts[0];
  
  // Use logged user or fallback to "Aluno"
  console.log('Current User:', user);
  const studentName = user?.name || 'Aluno';
  const studentAvatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentName}`;
  const studentPoints = user?.points || 0;
  const lastWorkoutDate = user?.lastWorkoutDate;

  const leagueInfo = getLeagueInfo(studentPoints);
  const { isDanger } = getInactivityStatus(lastWorkoutDate);

  // --- Dynamic Evolution Chart Logic ---
  const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  
  const getLast7DaysData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayName = WEEK_DAYS[date.getDay()];
      
      // Find workouts completed on this specific date
      const dailyWorkouts = activeWorkouts.length > 0 ? [] : []; // existing activeWorkouts variable is only uncompleted. 
      // Need to use all user workouts filtered by completion and date
      const completedOnDate = workouts.filter(w => {
        if (!w.completed || !w.completedAt) return false;
        const wDate = new Date(w.completedAt);
        return wDate.getDate() === date.getDate() &&
               wDate.getMonth() === date.getMonth() &&
               wDate.getFullYear() === date.getFullYear();
      });

      // Assume 45 mins per workout (since we don't track duration yet)
      const minutes = completedOnDate.length * 45;
      
      data.push({ day: dayName, val: minutes, date: date.toISOString() });
    }
    return data;
  };

  const chartData = getLast7DaysData();
  const maxChartVal = Math.max(...chartData.map(d => d.val), 60); // Minimum scale of 60 min

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 pb-20">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-2xl shadow-slate-200 dark:shadow-none overflow-hidden flex flex-col">
        {/* ... Header ... */}
        <div className="bg-primary p-6 text-white rounded-b-3xl shadow-lg shadow-primary/20 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                <span className="text-blue-200 text-sm font-normal block mb-1">Bem-vindo de volta,</span>
                {studentName}
              </h1>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 overflow-hidden">
              <img src={studentAvatar} alt="Avatar" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex gap-3">
            {/* Streak Card */}
            <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{user?.streak || 0}</p>
                <span className="text-xs font-medium text-blue-100">Dias seguidos</span>
              </div>
            </div>

            {/* Points Card */}
            <div 
              onClick={() => setShowLeagueModal(true)}
              className={`flex-1 rounded-xl p-3 backdrop-blur-sm border flex items-center gap-3 cursor-pointer transition-all ${
                isDanger 
                  ? 'bg-red-500/20 border-red-500/50 animate-pulse' 
                  : 'bg-white/10 border-white/10 hover:bg-white/20'
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-xl relative">
                {leagueInfo.current.icon}
                {isDanger && (
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 border border-white">
                    <AlertTriangle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{studentPoints}</p>
                <span className={`text-xs font-medium ${isDanger ? 'text-red-200' : 'text-blue-100'}`}>
                  {isDanger ? 'Risco de Queda!' : leagueInfo.current.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-grow">
          {/* Next Workout */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Próximo Treino
            </h3>
            {nextWorkout ? (
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{nextWorkout.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {nextWorkout.exercises?.length || 0} exercícios • {new Date(nextWorkout.dateCreated).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/app/student/workout', { state: { selectedWorkoutId: nextWorkout.id } })}
                  className="bg-accent text-primary font-bold px-4 py-2 rounded-lg text-sm hover:bg-accent-hover transition-colors"
                >
                  Iniciar
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 text-center">
                <p className="text-slate-500 dark:text-slate-400 font-medium">Tudo em dia! 🎉</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">Aguarde seu treinador enviar novos treinos.</p>
              </div>
            )}
          </div>

          {/* Evolution Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Sua Evolução
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-7">Tempo de treino (minutos)</p>
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Últimos 7 Dias</span>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-end justify-between h-40 gap-2 pt-6">
                {chartData.map((item, i) => {
                  const heightPct = (item.val / maxChartVal) * 100;
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 w-full h-full justify-end group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                        {item.val} min ({new Date(item.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})})
                      </div>

                      {/* Bar Value Label (Visible) */}
                      {item.val > 0 && (
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">
                          {item.val}
                        </span>
                      )}

                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg relative flex items-end h-full overflow-hidden">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-1000 ease-out ${
                            item.val > 0 ? 'bg-emerald-400 group-hover:bg-emerald-500' : 'bg-transparent'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gamification / Next Achievement */}
          <div className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Próxima Conquista
              </h3>
            </div>
            <div 
              onClick={() => setShowLeagueModal(true)}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {leagueInfo.next 
                    ? `Rumo ao Nível ${leagueInfo.next.name} ${leagueInfo.next.icon}`
                    : `Nível Máximo Alcançado! ${leagueInfo.current.icon}`
                  }
                </h4>
                <span className={`text-xs font-bold ${leagueInfo.current.color}`}>
                  {studentPoints}/{leagueInfo.next ? leagueInfo.next.min : 'MAX'} XP
                </span>
              </div>
              
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full ${leagueInfo.current.barColor} rounded-full transition-all duration-1000`} 
                  style={{ width: `${leagueInfo.progress}%` }}
                />
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {leagueInfo.next ? (
                  <>
                    Faltam apenas <span className={`font-bold ${leagueInfo.current.color}`}>{leagueInfo.remaining} XP</span>! Treine amanhã para evoluir.
                  </>
                ) : (
                  <span className="font-bold text-emerald-600">Você é uma lenda! Continue treinando para manter o topo. 👑</span>
                )}
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 pb-4">
            <a href="/app/student/terms" className="hover:text-primary hover:underline transition-colors">Termos de Uso</a> • <a href="/app/student/terms" className="hover:text-primary hover:underline transition-colors">Privacidade</a>
          </p>
        </div>
      </div>

      {/* League Info Modal */}
      <AnimatePresence>
        {showLeagueModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowLeagueModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <h3 className="font-bold text-lg text-slate-900">Sistema de Ligas</h3>
                <button onClick={() => setShowLeagueModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-4">
                {LEAGUES.map((league, index) => {
                  const isCurrent = league.name === leagueInfo.current.name;
                  const isNext = leagueInfo.next && league.name === leagueInfo.next.name;
                  
                  return (
                    <div 
                      key={league.name}
                      className={`relative p-4 rounded-2xl border-2 transition-all ${
                        isCurrent 
                          ? `border-${league.color.split('-')[1]}-500 bg-${league.color.split('-')[1]}-50` 
                          : 'border-slate-100 bg-white opacity-60'
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute -top-3 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          Atual
                        </span>
                      )}
                      
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{league.icon}</div>
                        <div>
                          <h4 className={`font-bold text-lg ${league.color}`}>{league.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {league.min} - {league.max === Infinity ? '∞' : league.max} XP
                          </p>
                        </div>
                      </div>

                      {isCurrent && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                            <span>Progresso</span>
                            <span>{Math.round(leagueInfo.progress)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${league.barColor}`} 
                              style={{ width: `${leagueInfo.progress}%` }} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Penalty Modal */}
      <AnimatePresence>
        {showPenaltyModal && (
          <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl text-center p-8 relative"
            >
              <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-2">VOCÊ PERDEU XP!</h2>
              <p className="text-slate-500 mb-6">
                Sua inatividade custou caro. Volte a treinar para recuperar seus pontos e não cair de liga!
              </p>
              
              <div className="bg-red-50 rounded-2xl p-4 mb-8 border border-red-100">
                <p className="text-sm text-red-400 font-bold uppercase tracking-wider mb-1">Penalidade</p>
                <div className="text-4xl font-black text-red-600 flex items-center justify-center gap-2">
                  -{PENALTY_XP} XP
                </div>
              </div>

              <button 
                onClick={() => setShowPenaltyModal(false)}
                className="w-full bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
              >
                ENTENDI, VOU TREINAR!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
