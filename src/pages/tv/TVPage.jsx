import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Activity, Zap } from 'lucide-react';
import { useFitManager } from '../../context/FitManagerContext';
import { getLeagueInfo } from '../../utils/gamification';

export default function TVPage() {
  const { students } = useFitManager();
  const [leaderboard, setLeaderboard] = useState([]);
  const listRef = React.useRef(null);

  // Initialize leaderboard from context
  useEffect(() => {
    if (!students) return;
    const sorted = [...students].sort((a, b) => b.points - a.points);
    setLeaderboard(sorted);
  }, [students]);

  // Simulate live updates for TV effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard(prev => {
        const newData = [...prev];
        if (newData.length === 0) return newData;
        
        const randomIndex = Math.floor(Math.random() * Math.min(newData.length, 5));
        newData[randomIndex] = {
          ...newData[randomIndex],
          points: (newData[randomIndex].points || 0) + Math.floor(Math.random() * 50)
        };
        return newData.sort((a, b) => b.points - a.points);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 10); // Show top 10

  if (leaderboard.length === 0) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 overflow-hidden font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
            <Activity className="h-10 w-10 text-slate-900" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">FitManager <span className="text-accent">TV</span></h1>
            <p className="text-slate-400 text-lg">Monitoramento em Tempo Real</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xl font-bold tracking-wider">RANKING AO VIVO</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1">
        {/* Top 3 Podium */}
        <div className="lg:col-span-2 flex items-end justify-center gap-6 pb-12">
          {/* 2nd Place */}
          {top3[1] && <PodiumItem student={top3[1]} rank={2} />}

          {/* 1st Place */}
          {top3[0] && <PodiumItem student={top3[0]} rank={1} />}

          {/* 3rd Place */}
          {top3[2] && <PodiumItem student={top3[2]} rank={3} />}
        </div>

        {/* The List (4-10) */}
        <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700 overflow-hidden flex flex-col h-[calc(100vh-280px)]">
          <h3 className="text-xl font-bold text-slate-400 mb-6 uppercase tracking-widest px-2">Outros Colocados</h3>
          <div 
            ref={listRef}
            className="space-y-3 flex-1 overflow-y-hidden pr-2 relative"
          >
            <div className="animate-scroll-vertical">
              {/* Duplicate list for seamless infinite scroll */}
              {[...rest, ...rest].map((student, index) => {
                const realIndex = index % rest.length;
                const rank = realIndex + 4;
                const league = getLeagueInfo(student.points).current;
                
                // LGPD Check
                const isHidden = student.privacy?.hideInRanking;
                const displayName = isHidden ? 'Aluno Anônimo' : student.name;
                const displayAvatar = isHidden 
                  ? `https://ui-avatars.com/api/?name=A&background=random&color=fff` 
                  : student.avatar;

                // Unique key for the duplicated list
                const key = `${student.id}-${index}`;

                return (
                  <div key={key} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700/50 mb-3">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-slate-400 w-8 text-center">{rank}</span>
                      <img 
                        src={displayAvatar} 
                        alt={displayName} 
                        className={`w-12 h-12 rounded-full bg-slate-700 border border-slate-600 ${isHidden ? 'blur-[1px]' : ''}`} 
                      />
                      <div>
                        <h4 className="font-bold text-lg text-white">{displayName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-700 ${league.color} border border-slate-600`}>
                            {league.icon} {league.name}
                          </span>
                          <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {student.workouts}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-accent">{student.points.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">XP</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-vertical {
          animation: scroll-vertical 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

function PodiumItem({ student, rank }) {
  const league = getLeagueInfo(student.points).current;
  const isFirst = rank === 1;
  const height = isFirst ? 'h-80' : rank === 2 ? 'h-64' : 'h-56';
  const color = isFirst ? 'yellow-400' : rank === 2 ? 'slate-300' : 'amber-700';
  const Icon = isFirst ? Trophy : Medal;

  // LGPD Check
  const isHidden = student.privacy?.hideInRanking;
  const displayName = isHidden ? 'Aluno Anônimo' : student.name;
  const displayAvatar = isHidden 
    ? `https://ui-avatars.com/api/?name=A&background=random&color=fff` 
    : student.avatar;

  return (
    <div className={`flex flex-col items-center w-1/3 ${isFirst ? 'z-10 -mb-8' : ''}`}>
      <div className={`relative ${isFirst ? 'mb-6' : 'mb-4'}`}>
        {isFirst && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce z-20">
            <Trophy className="h-20 w-20 text-yellow-400 fill-yellow-400 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
          </div>
        )}
        <img 
          src={displayAvatar} 
          alt={displayName} 
          className={`rounded-full border-4 border-${color} shadow-[0_0_40px_rgba(0,0,0,0.3)] relative z-10 ${isFirst ? 'w-40 h-40' : 'w-32 h-32'} ${isHidden ? 'blur-[2px]' : ''}`} 
          style={{ borderColor: isFirst ? '#facc15' : rank === 2 ? '#cbd5e1' : '#b45309' }}
        />
        <div 
          className={`absolute -bottom-5 left-1/2 -translate-x-1/2 font-bold rounded-full shadow-xl flex items-center gap-2 z-20 ${isFirst ? 'px-6 py-2 text-lg' : 'px-4 py-1'}`}
          style={{ 
            backgroundColor: isFirst ? '#facc15' : rank === 2 ? '#cbd5e1' : '#b45309',
            color: isFirst ? '#713f12' : rank === 2 ? '#0f172a' : '#fffbeb'
          }}
        >
          <Icon className={isFirst ? "h-5 w-5" : "h-4 w-4"} /> {rank}º
        </div>
      </div>
      
      <div 
        className={`w-full ${height} rounded-t-3xl flex flex-col items-center justify-start pt-10 border-t-4 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900`}
        style={{ borderColor: isFirst ? '#facc15' : rank === 2 ? '#cbd5e1' : '#b45309' }}
      >
        <h2 className="text-2xl font-bold mb-1 text-center text-white drop-shadow-md px-2 truncate w-full">{displayName}</h2>
        
        {/* League Badge */}
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-700 mb-2 ${league.color}`}>
          <span className="text-lg">{league.icon}</span>
          <span className="font-bold text-sm uppercase tracking-wider">{league.name}</span>
        </div>

        <div 
          className="text-4xl font-black mb-1"
          style={{ color: isFirst ? '#facc15' : rank === 2 ? '#cbd5e1' : '#b45309' }}
        >
          {student.points.toLocaleString()}
        </div>
        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Pontos XP</div>
        
        <div 
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ 
            backgroundColor: isFirst ? 'rgba(250, 204, 21, 0.1)' : 'rgba(148, 163, 184, 0.1)',
            color: isFirst ? '#facc15' : '#94a3b8'
          }}
        >
          <Flame className="h-5 w-5" />
          <span className="font-bold">{student.workouts} Treinos</span>
        </div>
      </div>
    </div>
  );
}
