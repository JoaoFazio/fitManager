import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Dumbbell,
  Bell,
  Smartphone,
  DollarSign
} from 'lucide-react';
import { useFitManager } from '../context/FitManagerContext';

export default function DashboardLayout() {
  const { logout, user } = useFitManager();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-accent p-2 rounded-lg">
            <Dumbbell className="h-6 w-6 text-primary" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">FitManager</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem to="/admin/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
          <NavItem to="/admin/students" icon={<Users />} label="Alunos" />
          <NavItem to="/admin/workouts" icon={<Dumbbell />} label="Treinos" />
          <NavItem to="/admin/finance" icon={<DollarSign />} label="Financeiro" />
          <NavItem to="/admin/settings" icon={<Settings />} label="Configurações" />
          
          <div className="pt-4 mt-4 border-t border-primary-light">
            <NavItem to="/app/student" icon={<Smartphone />} label="App do Aluno" />
          </div>
        </nav>
        <div className="p-4 border-t border-primary-light">
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-primary-light hover:text-white transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-surface border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="w-96">
            <h2 className="text-xl font-bold" style={{ color: '#000000' }}>
              {(() => {
                const path = location.pathname;
                if (path.includes('/dashboard')) return 'Dashboard';
                if (path.includes('/students')) return 'Alunos';
                if (path.includes('/workouts')) return 'Treinos';
                if (path.includes('/finance')) return 'Financeiro';
                if (path.includes('/settings')) return 'Configurações';
                return 'FitManager';
              })()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <h4 className="font-bold text-sm text-slate-900">Notificações</h4>
                  </div>
                  <div className="px-4 py-8 text-center text-slate-500 text-sm">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p>Nenhuma notificação nova</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">{user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-500">Gerente</p>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm">
                   <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`} alt="Avatar" className="h-full w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-accent text-primary shadow-lg shadow-accent/20 font-bold translate-x-1' 
          : 'text-slate-300 hover:bg-primary-light hover:text-white hover:translate-x-1'
      }`}
    >
      {React.cloneElement(icon, { size: 20 })}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
