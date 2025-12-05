import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useFitManager } from '../../context/FitManagerContext';
import { useNavigate } from 'react-router-dom';
import { User, Building, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { user, logout, updateUser } = useFitManager();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  // State for form fields
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  const [gymData, setGymData] = useState({
    gymName: '',
    phone: '',
    address: '',
  });

  // Sync state with user context when it changes
  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
      setGymData({
        gymName: user.gymName || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);



  const showSuccessToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveProfile = () => {
    updateUser({ name: profileData.name });
    showSuccessToast();
  };

  const handleSaveGym = () => {
    updateUser({ 
      gymName: gymData.gymName,
      phone: gymData.phone,
      address: gymData.address
    });
    showSuccessToast();
  };

  return (
    <div className="space-y-8 max-w-4xl relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3"
          >
            <CheckCircle className="h-6 w-6" />
            <div>
              <h4 className="font-bold">Sucesso!</h4>
              <p className="text-sm text-green-50">Alterações salvas com sucesso!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <p className="text-slate-500">Gerencie seu perfil e preferências do sistema.</p>
      </div>

      <div className="grid gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  <CardTitle>Perfil do Usuário</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden">
                      <img 
                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                        alt="Avatar" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <label 
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-accent text-slate-900 p-2 rounded-full shadow-md hover:bg-accent/90 transition-colors cursor-pointer border-2 border-white"
                    >
                      <User className="h-4 w-4" />
                      <input 
                        id="avatar-upload"
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateUser({ avatar: reader.result });
                              showSuccessToast();
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                  <Input 
                    value={profileData.name} 
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">E-mail</label>
                  <Input value={profileData.email} disabled className="bg-slate-50 text-slate-500 cursor-not-allowed" />
                  <p className="text-xs text-slate-400">O e-mail não pode ser alterado.</p>
                </div>
              </CardContent>
            </div>
            <div className="flex justify-end border-t p-6">
              <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
            </div>
          </Card>

          {/* Gym Details */}
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-accent" />
                  <CardTitle>Dados da Academia</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nome da Academia</label>
                  <Input 
                    value={gymData.gymName} 
                    onChange={(e) => setGymData({ ...gymData, gymName: e.target.value })}
                    placeholder="Ex: Iron Gym"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Telefone</label>
                    <Input 
                      placeholder="(00) 00000-0000" 
                      value={gymData.phone}
                      onChange={(e) => setGymData({ ...gymData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Endereço</label>
                    <Input 
                      name="gym_address_field_random_v3"
                      autoComplete="new-password"
                      type="search"
                      onFocus={(e) => e.target.type = 'text'}
                      data-lpignore="true"
                      placeholder="Rua Exemplo, 123" 
                      value={gymData.address}
                      onChange={(e) => setGymData({ ...gymData, address: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </div>
            <div className="flex justify-end border-t p-6">
              <Button onClick={handleSaveGym}>Salvar Alterações</Button>
            </div>
          </Card>
        </div>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <CardTitle>Segurança</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hidden input to trick browser autofill */}
              <input type="password" style={{ display: 'none' }} />
              

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nova Senha</label>
                <Input 
                  type="text" 
                  className="input-field password-mask"
                  placeholder="••••••••" 
                  autoComplete="off"
                  data-lpignore="true"
                />
                <p className="text-xs text-slate-500">Mínimo de 8 caracteres</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Confirmar Nova Senha</label>
                <Input 
                  type="text" 
                  className="input-field password-mask"
                  placeholder="••••••••" 
                  autoComplete="off"
                  data-lpignore="true"
                />
              </div>
            </div>
          </CardContent>
          <div className="flex justify-end border-t p-6">
            <Button onClick={showSuccessToast}>Atualizar Senha</Button>
          </div>
        </Card>






      </div>
    </div>
  );
}
