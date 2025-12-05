import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Dumbbell, User } from 'lucide-react';

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 flex flex-col">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 h-16 flex items-center justify-around px-4 z-50">
          <MobileNavItem to="/app/student/home" icon={<Home />} label="Home" />
          <MobileNavItem to="/app/student/workout" icon={<Dumbbell />} label="Workouts" />
          <MobileNavItem to="/app/student/profile" icon={<User />} label="Profile" />
        </nav>
      </div>
    </div>
  );
}

function MobileNavItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
        isActive 
          ? 'text-brand-primary' 
          : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
