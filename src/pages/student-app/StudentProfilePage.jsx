import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, CreditCard, Bell, ChevronRight, LogOut, CheckCircle, Camera, X, Save, Edit2, History, Smartphone } from 'lucide-react';
import { useFitManager } from '../../context/FitManagerContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentProfilePage() {
  const { user, logout, updateUser, theme = 'light', toggleTheme = () => {}, workouts } = useFitManager();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Filter completed workouts for this user
  const history = workouts
    .filter(w => w.completed && String(w.studentId) === String(user?.id))
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  
  // Force HMR update

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'personal', 'settings', 'subscription'
  
  // Settings State (Mock)
  const [settings, setSettings] = useState({
    notifications: true,
    vibration: true,
    darkMode: theme === 'dark',
    hideInRanking: user?.privacy?.hideInRanking || false
  });

  // Sync settings with theme
  useEffect(() => {
    setSettings(prev => ({ ...prev, darkMode: theme === 'dark' }));
  }, [theme]);

  const handleSettingChange = (key) => {
    if (key === 'darkMode') {
      toggleTheme();
    } else {
      setSettings(prev => {
        const newSettings = { ...prev, [key]: !prev[key] };
        
        // Persist privacy setting
        if (key === 'hideInRanking') {
          updateUser({
            privacy: {
              ...user?.privacy,
              hideInRanking: newSettings.hideInRanking
            }
          });
        }
        
        return newSettings;
      });
    }
  };
  
  // Form State
  const [editName, setEditName] = useState(user?.name || '');
  const [editGoal, setEditGoal] = useState(user?.goal || 'Hipertrofia');

  // Use logged user or fallback to "Visitante"
  const studentName = user?.name || 'Visitante';
  const studentEmail = user?.email || 'visitante@fitmanager.com';
  const studentAvatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentName}`;
  const studentPlan = user?.plan || 'Mensal';
  const studentGoal = user?.goal || 'Hipertrofia';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showNotification = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result });
        showNotification("Foto de perfil atualizada!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateUser({ name: editName, goal: editGoal });
    setIsEditing(false);
    showNotification("Perfil atualizado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 pb-20 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-xl z-50 text-sm font-medium whitespace-nowrap flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-green-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                <h3 className="font-bold text-lg flex items-center gap-2 dark:text-white">
                  <History className="h-5 w-5 text-primary" /> Histórico de Treinos
                </h3>
                <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full">
                  <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {history.length > 0 ? (
                  history.map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{workout.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(workout.completedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Concluído
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>Nenhum treino concluído ainda.</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => setShowHistory(false)} className="w-full btn-primary py-2 text-sm">Fechar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Personal Data Modal */}
      <AnimatePresence>
        {activeModal === 'personal' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                <h3 className="font-bold text-lg flex items-center gap-2 dark:text-white">
                  <User className="h-5 w-5 text-primary" /> Dados Pessoais
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full">
                  <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-600 shadow-lg overflow-hidden mb-2">
                    <img src={studentAvatar} alt="Avatar" className="h-full w-full object-cover" />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">{studentName}</h4>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">{studentPlan}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <label className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase block mb-1">Email</label>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">{studentEmail}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <label className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase block mb-1">Telefone</label>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">(11) 99999-9999</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <label className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase block mb-1">Data de Nascimento</label>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">
                      {user?.birthdate ? new Date(user.birthdate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {activeModal === 'settings' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                <h3 className="font-bold text-lg flex items-center gap-2 dark:text-white">
                  <Settings className="h-5 w-5 text-primary" /> Configurações
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full">
                  <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'notifications', label: 'Notificações de Treino', desc: 'Receba lembretes para treinar' },
                  { key: 'vibration', label: 'Vibração', desc: 'Feedback tátil ao interagir' },
                  { key: 'darkMode', label: 'Modo Escuro', desc: 'Tema escuro para o app' },
                  { key: 'hideInRanking', label: 'Privacidade (LGPD)', desc: 'Ocultar nome no ranking da TV' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{item.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleSettingChange(item.key)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings[item.key] ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subscription Modal */}
      <AnimatePresence>
        {activeModal === 'subscription' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                <h3 className="font-bold text-lg flex items-center gap-2 dark:text-white">
                  <CreditCard className="h-5 w-5 text-primary" /> Assinatura
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full">
                  <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <div className="p-6 text-center">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Plano {studentPlan}</h4>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 inline-block px-3 py-1 rounded-full mb-6">
                  Status: Ativo
                </p>
                
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-left space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Valor</span>
                    <span className="font-bold text-slate-900 dark:text-white">R$ 99,90/mês</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Próxima Cobrança</span>
                    <span className="font-bold text-slate-900 dark:text-white">25/12/2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Forma de Pagamento</span>
                    <span className="font-bold text-slate-900 dark:text-white">Cartão •••• 1234</span>
                  </div>
                </div>

                <button className="w-full border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Gerenciar Assinatura
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-2xl shadow-slate-200 dark:shadow-none overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Perfil</h1>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
            >
              {isEditing ? <X className="h-5 w-5 dark:text-white" /> : <Edit2 className="h-5 w-5 dark:text-white" />}
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden">
                <img src={studentAvatar} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <button 
                onClick={handlePhotoClick}
                className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary-light transition-colors border-2 border-white dark:border-slate-800"
              >
                <Camera className="h-3 w-3" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded px-2 py-1 text-sm font-bold"
                    placeholder="Seu Nome"
                  />
                  <select 
                    value={editGoal}
                    onChange={(e) => setEditGoal(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded px-2 py-1 text-xs"
                  >
                    <option value="Hipertrofia">Hipertrofia</option>
                    <option value="Emagrecimento">Emagrecimento</option>
                    <option value="Condicionamento">Condicionamento</option>
                  </select>
                  <button 
                    onClick={handleSaveProfile}
                    className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-green-600"
                  >
                    <Save className="h-3 w-3" /> Salvar
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{studentName}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{studentEmail}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="inline-block px-2 py-0.5 bg-accent/20 text-primary-light dark:text-accent font-bold text-xs rounded-full">
                      {studentPlan}
                    </span>
                    <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full">
                      {studentGoal}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <ProfileLink icon={<User />} label="Dados Pessoais" onClick={() => setActiveModal('personal')} />
            <ProfileLink icon={<History />} label="Histórico de Treinos" onClick={() => setShowHistory(true)} />
            <ProfileLink icon={<Settings />} label="Configurações do App" onClick={() => setActiveModal('settings')} />
            <ProfileLink icon={<CreditCard />} label="Assinatura" onClick={() => setActiveModal('subscription')} />
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-xl transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sair do App
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6 pb-4">
            <a href="/app/student/terms" className="hover:text-primary hover:underline transition-colors">Termos de Uso</a> • <a href="/app/student/terms" className="hover:text-primary hover:underline transition-colors">Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileLink({ icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors group"
    >
      <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-accent">
        {React.cloneElement(icon, { size: 20 })}
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-accent" />
    </button>
  );
}
