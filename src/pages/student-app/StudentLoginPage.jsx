import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitManager } from '../../context/FitManagerContext';
import { User, ChevronRight } from 'lucide-react';

export default function StudentLoginPage() {
  const { students, loginAsStudent } = useFitManager();
  const navigate = useNavigate();

  const handleSelectStudent = (studentId) => {
    if (loginAsStudent(studentId)) {
      navigate('/app/student/home');
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 p-6 flex flex-col justify-center max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary">FitManager App</h1>
        <p className="text-slate-500 dark:text-slate-400">Selecione um aluno para entrar</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-700">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => handleSelectStudent(student.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-600 shadow-sm overflow-hidden">
                  <img 
                    src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} 
                    alt={student.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">{student.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{student.plan}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
            </button>
          ))}

          {students.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <User className="h-12 w-12 mx-auto mb-2 opacity-20 dark:text-slate-400" />
              <p>Nenhum aluno cadastrado.</p>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-8 px-4">
        Ao entrar, você concorda com nossos <a href="/app/student/terms" className="text-primary hover:underline">Termos de Uso</a> e <a href="/app/student/terms" className="text-primary hover:underline">Política de Privacidade</a>, incluindo a participação no ranking gamificado.
      </p>
    </div>
  );
}
