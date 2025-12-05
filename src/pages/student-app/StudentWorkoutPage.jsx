import React, { useState, useEffect, useRef } from 'react';
import { Flame, PlayCircle, CheckCircle2, Circle, Trophy, ChevronLeft, Dumbbell, Calendar, Timer, X, Clock, Tag } from 'lucide-react';
import { useFitManager } from '../../context/FitManagerContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLeagueInfo, calculateNewStreak, calculateXP } from '../../utils/gamification';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function StudentWorkoutPage() {
  const { user, getStudentWorkouts, completeWorkout } = useFitManager();
  const navigate = useNavigate();
  const location = useLocation();
  // Use logged user ID
  const workouts = getStudentWorkouts(user?.id);
  
  // Filter and Sort Workouts
  const activeWorkouts = workouts
    .filter(w => !w.completed)
    .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

  const completedWorkouts = workouts
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.completedAt || b.dateCreated) - new Date(a.completedAt || a.dateCreated));

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [promotedLeague, setPromotedLeague] = useState(null);
  const [earnedXP, setEarnedXP] = useState({ total: 0, base: 0, bonus: 0 });
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const hasAutoSelected = useRef(false);

  // Auto-select workout from navigation state
  useEffect(() => {
    if (!hasAutoSelected.current && location.state?.selectedWorkoutId && workouts.length > 0) {
      const workoutToSelect = workouts.find(w => w.id === location.state.selectedWorkoutId);
      if (workoutToSelect) {
        setSelectedWorkout(workoutToSelect);
        hasAutoSelected.current = true;
      }
    }
  }, [location.state, workouts]);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    // Only run timer if workout is selected, not completed, and modal is closed
    if (selectedWorkout && !selectedWorkout.completed && !showVictoryModal) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (!selectedWorkout) {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [selectedWorkout, showVictoryModal]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleExercise = (id) => {
    if (completedExercises.includes(id)) {
      setCompletedExercises(completedExercises.filter(exId => exId !== id));
    } else {
      setCompletedExercises([...completedExercises, id]);
    }
  };

  const handleFinishWorkout = () => {
    if (selectedWorkout?.completed) return;

    const currentPoints = user?.points || 0;
    const currentStreak = user?.streak || 0;
    const lastWorkoutDate = user?.lastWorkoutDate;

    // Calculate XP locally for display
    const newStreak = calculateNewStreak(lastWorkoutDate, currentStreak);
    const xpCalculation = calculateXP(newStreak);
    setEarnedXP(xpCalculation);

    const currentLeague = getLeagueInfo(currentPoints).current;
    const newLeague = getLeagueInfo(currentPoints + xpCalculation.total).current;

    if (newLeague.min > currentLeague.min) {
      setPromotedLeague(newLeague);
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    completeWorkout(user.id, selectedWorkout.id); // Context handles the actual update
    setShowVictoryModal(true);
  };

  const handleCloseVictory = () => {
    setShowVictoryModal(false);
    if (promotedLeague) {
      setShowPromotionModal(true);
      // Trigger confetti again for promotion
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FFFFFF']
        });
      }, 300);
    } else {
      setSelectedWorkout(null);
      navigate('/app/student/home');
    }
  };

  const handleClosePromotion = () => {
    setShowPromotionModal(false);
    setPromotedLeague(null);
    setSelectedWorkout(null);
    navigate('/app/student/home');
  };

  const handleOpenVideo = (exerciseName) => {
    setCurrentVideo(exerciseName);
    setVideoModalOpen(true);
  };

  const calculateVolume = (exercises) => {
    if (!exercises) return 0;
    return exercises.reduce((acc, ex) => {
      const sets = parseInt(ex.sets) || 0;
      const reps = parseInt(ex.reps) || 0;
      const weight = parseInt(ex.weight) || 0;
      return acc + (sets * reps * weight);
    }, 0);
  };

  // List View
  if (!selectedWorkout) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-900 pb-20">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-2xl shadow-slate-200 dark:shadow-none overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Meus Treinos</h1>
            
            {/* Active Workouts */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Próximos Treinos</h2>
              {activeWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {activeWorkouts.map(workout => (
                    <div 
                      key={workout.id}
                      onClick={() => setSelectedWorkout(workout)}
                      className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-lg text-sm inline-block">
                          {workout.name}
                        </div>
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">
                          {workout.exercises?.length || 0} exercícios
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Criado em {new Date(workout.dateCreated).toLocaleDateString('pt-BR')}</p>
                      <div className="flex items-center gap-2 text-sm font-medium text-accent">
                        <PlayCircle className="h-4 w-4" />
                        Começar Treino
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <Dumbbell className="h-10 w-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Tudo em dia!</p>
                </div>
              )}
            </div>

            {/* Completed Workouts (History) */}
            {completedWorkouts.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Histórico
                </h2>
                <div className="space-y-4 opacity-75 hover:opacity-100 transition-opacity">
                  {completedWorkouts.map(workout => (
                    <div 
                      key={workout.id}
                      onClick={() => setSelectedWorkout(workout)}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{workout.name}</span>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                          Concluído
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Finalizado em {new Date(workout.completedAt || Date.now()).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Detail View
  const exercises = selectedWorkout.exercises || [];
  const progress = Math.round((completedExercises.length / exercises.length) * 100);

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 pb-8 relative">
      {/* Victory Modal */}
      <AnimatePresence>
        {showVictoryModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl text-center p-8"
            >
              <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">TREINO CONCLUÍDO!</h2>
              
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-slate-700">
                <p className="text-4xl font-black text-emerald-600 mb-1">+{earnedXP.total} XP</p>
                <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Treino Base</span>
                    <span className="font-bold">+{earnedXP.base}</span>
                  </div>
                  {earnedXP.bonus > 0 && (
                    <div className="flex justify-between text-orange-500 font-bold">
                      <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> Bônus de Sequência</span>
                      <span>+{earnedXP.bonus}</span>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleCloseVictory}
                className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95"
              >
                CONTINUAR
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Promotion Modal */}
      <AnimatePresence>
        {showPromotionModal && promotedLeague && (
          <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl text-center p-8 relative"
            >
              <div className={`absolute top-0 left-0 w-full h-2 ${promotedLeague.barColor}`} />
              
              <div className="mb-6 relative inline-block">
                <div className={`absolute inset-0 ${promotedLeague.barColor} blur-3xl opacity-40 rounded-full`} />
                <div className="text-8xl relative z-10 animate-bounce">
                  {promotedLeague.icon}
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">SUBIU DE NÍVEL!</h2>
              <p className="text-slate-500 mb-6">
                Parabéns! Você alcançou a liga <span className={`font-bold ${promotedLeague.color}`}>{promotedLeague.name}</span>.
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 mb-8 border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Novo Status</p>
                <div className={`text-2xl font-black ${promotedLeague.color} flex items-center justify-center gap-2`}>
                  {promotedLeague.name} {promotedLeague.icon}
                </div>
              </div>

              <button 
                onClick={handleClosePromotion}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-light transition-all active:scale-95"
              >
                CONTINUAR
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setVideoModalOpen(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                <h3 className="font-bold text-slate-900 dark:text-white">Vídeo Demonstrativo</h3>
                <button onClick={() => setVideoModalOpen(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors">
                  <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center relative group">
                {/* Placeholder for real video */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
                <PlayCircle className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transition-opacity relative z-10" />
                <p className="absolute bottom-4 left-0 right-0 text-center text-white font-medium text-sm z-10">
                  Visualizando: {currentVideo}
                </p>
              </div>
              <div className="p-4">
                <button 
                  onClick={() => setVideoModalOpen(false)}
                  className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-2xl shadow-slate-200 dark:shadow-none overflow-hidden relative">
        
        {/* Header with Timer */}
        <div className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 border-b border-slate-50 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedWorkout(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <ChevronLeft className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{selectedWorkout.name}</h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full font-mono font-bold text-slate-700 dark:text-slate-300">
            <Timer className="h-4 w-4 text-accent" />
            {selectedWorkout.completed ? 'Concluído' : formatTime(seconds)}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Hero Card */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0A2E5B] text-white p-6 shadow-lg shadow-primary/20">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                    selectedWorkout.completed 
                      ? 'bg-accent text-primary' 
                      : 'bg-white/20 text-white'
                  }`}>
                    {selectedWorkout.completed ? 'Finalizado!' : 'Em Andamento'}
                  </span>
                  {/* Category Badge - Subtle */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black/20 text-blue-100 backdrop-blur-sm">
                    <Tag className="h-3 w-3" />
                    Musculação
                  </span>
                </div>

                {/* Metadata Column */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-blue-100 text-sm font-medium mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>07 Nov</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-blue-100 text-xs opacity-80">
                    <Clock className="h-3 w-3" />
                    <span>45 min</span>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-auto text-accent tracking-tight leading-tight max-w-[80%]">
                {selectedWorkout.name}
              </h2>
              
              <div className="mt-6">
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-0.5">Volume Total</p>
                <p className="text-white text-2xl font-bold">
                  {calculateVolume(selectedWorkout.exercises).toLocaleString('pt-BR')}kg
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-accent rounded-full opacity-20 blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-2xl" />
            
            {/* Watermark Icon */}
            <Dumbbell className="absolute -bottom-6 -right-6 w-40 h-40 text-white opacity-5 -rotate-12 pointer-events-none" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent" />
              Exercícios
            </h3>
            
            {exercises.map((exercise) => (
              <div 
                key={exercise.id} 
                className={`transition-all duration-200 rounded-xl border p-4 ${
                  completedExercises.includes(exercise.id) 
                    ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-50' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => !selectedWorkout.completed && toggleExercise(exercise.id)}
                    className={`flex-shrink-0 transition-colors ${selectedWorkout.completed ? 'cursor-not-allowed opacity-80' : ''}`}
                    disabled={selectedWorkout.completed}
                  >
                    {completedExercises.includes(exercise.id) || selectedWorkout.completed ? (
                      <CheckCircle2 className="h-8 w-8 text-accent fill-green-50 dark:fill-green-900/20" />
                    ) : (
                      <Circle className="h-8 w-8 text-slate-200 dark:text-slate-600 hover:text-accent" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold text-lg transition-all duration-200 ${
                        completedExercises.includes(exercise.id) || selectedWorkout.completed 
                          ? 'text-slate-400 dark:text-slate-600 line-through decoration-slate-400 opacity-60' 
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {exercise.name}
                      </h4>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenVideo(exercise.name); }}
                        className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors"
                      >
                        <PlayCircle className="h-5 w-5" />
                      </button>
                    </div>
                    <div className={`flex items-center gap-3 text-sm transition-colors duration-200 ${
                      completedExercises.includes(exercise.id) || selectedWorkout.completed 
                        ? 'text-slate-300 dark:text-slate-600 opacity-60' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                        {exercise.sets} séries
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                        {exercise.reps} reps
                      </span>
                      {exercise.weight && (
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                          {exercise.weight}kg
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Finish Button */}
          <div className="pt-4 pb-8">
            <button 
              className={`w-full font-bold h-14 text-lg rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedWorkout.completed 
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow-none' 
                  : 'bg-primary text-white hover:bg-primary-light shadow-primary/20'
              }`}
              onClick={handleFinishWorkout}
              disabled={progress < 100 || selectedWorkout.completed}
            >
              {selectedWorkout.completed 
                ? `TREINO FINALIZADO EM ${selectedWorkout.completedAt ? new Date(selectedWorkout.completedAt).toLocaleDateString('pt-BR') : ''}`
                : (progress < 100 ? 'COMPLETE TODOS OS EXERCÍCIOS' : 'CONCLUIR TREINO 🎉')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
