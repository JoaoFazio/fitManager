import React from 'react';
import { X, Dumbbell, DollarSign, Users, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ActivityModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const activities = [
    { id: 1, user: 'Carlos Silva', action: 'concluiu o treino', target: 'Hipertrofia A', time: '2 min atrás', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 2, user: 'Ana Souza', action: 'renovou o plano', target: 'Trimestral', time: '15 min atrás', icon: <DollarSign className="h-4 w-4" /> },
    { id: 3, user: 'Pedro Santos', action: 'fez check-in', target: 'Musculação', time: '1 hora atrás', icon: <Users className="h-4 w-4" /> },
    { id: 4, user: 'Mariana Costa', action: 'atingiu meta', target: 'Perda de Peso', time: '3 horas atrás', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 5, user: 'João Oliveira', action: 'concluiu o treino', target: 'Cardio Intenso', time: '4 horas atrás', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 6, user: 'Fernanda Lima', action: 'fez check-in', target: 'Pilates', time: '5 horas atrás', icon: <Users className="h-4 w-4" /> },
    { id: 7, user: 'Ricardo Alves', action: 'renovou o plano', target: 'Mensal', time: 'Ontem', icon: <DollarSign className="h-4 w-4" /> },
    { id: 8, user: 'Juliana Rocha', action: 'concluiu o treino', target: 'Pernas', time: 'Ontem', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 9, user: 'Lucas Pereira', action: 'atingiu meta', target: 'Ganho de Massa', time: '2 dias atrás', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 10, user: 'Camila Martins', action: 'fez check-in', target: 'Yoga', time: '2 dias atrás', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-lg text-slate-900">Histórico de Atividades</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium text-slate-700">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
            <button onClick={onClose} className="text-sm font-medium text-slate-500 hover:text-slate-900">
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
