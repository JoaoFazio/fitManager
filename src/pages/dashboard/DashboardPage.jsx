import React, { useState } from 'react';
import { Users, Dumbbell, TrendingUp, DollarSign, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFitManager } from '../../context/FitManagerContext';
import { ActivityModal } from '../../components/dashboard/ActivityModal';

export default function DashboardPage() {
  const { stats, user, recentActivities } = useFitManager();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 mt-1">Bem-vindo de volta, {user?.name || 'Admin'}!</p>
        </div>
        <Link to="/tv" target="_blank">
          <button className="btn-secondary flex items-center gap-2 shadow-lg shadow-primary/20">
            <Tv className="h-5 w-5" />
            Abrir Modo TV
          </button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Alunos Ativos" 
          value={stats.activeStudents} 
          trend="+12%" 
          icon={<Users className="h-5 w-5 text-primary" />} 
          color="bg-blue-50"
        />
        <MetricCard 
          title="Receita Mensal" 
          value={`R$ ${stats.financials?.revenue.toLocaleString('pt-BR') || '0,00'}`} 
          trend="+8%" 
          icon={<DollarSign className="h-5 w-5 text-accent" />} 
          color="bg-green-50"
        />
        <MetricCard 
          title="Treinos Realizados" 
          value="128" 
          trend="+24%" 
          icon={<Dumbbell className="h-5 w-5 text-purple-600" />} 
          color="bg-purple-50"
        />
        <MetricCard 
          title="Taxa de Retenção" 
          value="94%" 
          trend="+2%" 
          icon={<TrendingUp className="h-5 w-5 text-orange-600" />} 
          color="bg-orange-50"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-slate-900">Últimas Atividades</h3>
          <button 
            className="text-sm text-primary hover:underline"
            onClick={() => setIsActivityModalOpen(true)}
          >
            Ver tudo
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivities && recentActivities.length > 0 ? (
            recentActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  {activity.type === 'workout' && <Dumbbell className="h-4 w-4" />}
                  {activity.type === 'finance' && <DollarSign className="h-4 w-4" />}
                  {activity.type === 'checkin' && <Users className="h-4 w-4" />}
                  {activity.type === 'student' && <Users className="h-4 w-4" />}
                  {activity.type === 'general' && <TrendingUp className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium text-slate-700">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Intl.RelativeTimeFormat('pt-BR', { style: 'short', numeric: 'auto' }).format(
                      Math.ceil((new Date(activity.time) - new Date()) / (1000 * 60)), // Minutes diff
                      'minute'
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm text-center py-4">Nenhuma atividade recente.</p>
          )}
        </div>
      </div>

      <ActivityModal 
        isOpen={isActivityModalOpen} 
        onClose={() => setIsActivityModalOpen(false)} 
      />
    </div>
  );
}

function MetricCard({ title, value, trend, icon, color }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex flex-row items-center justify-between pb-4">
        <h3 className="text-sm font-medium !text-slate-500">
          {title}
        </h3>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {trend} <span className="text-slate-400 font-normal">vs mês anterior</span>
        </p>
      </div>
    </div>
  );
}
