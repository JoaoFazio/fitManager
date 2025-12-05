import React, { useState } from 'react';
import { Plus, Trash2, Save, Dumbbell, CheckCircle } from 'lucide-react';
import { exercisesData } from '../../data/exercisesData';
import { useFitManager } from '../../context/FitManagerContext';
import { WORKOUT_TEMPLATES } from '../../data/workoutTemplates';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkoutPage() {
  const { students, addWorkout } = useFitManager();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([
    { id: Date.now(), exerciseId: '', sets: 3, reps: '12', weight: '' }
  ]);
  const [showToast, setShowToast] = useState(false);

  const loadTemplate = (templateId) => {
    const template = WORKOUT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setWorkoutName(template.name);
      setExercises(template.exercises.map(ex => ({
        ...ex,
        id: Date.now() + Math.random() // Ensure unique IDs
      })));
    }
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { id: Date.now(), exerciseId: '', sets: 3, reps: '12', weight: '' }
    ]);
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const updateExercise = (id, field, value) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSave = () => {
    if (!selectedStudent || !workoutName) {
      alert('Por favor, selecione um aluno e insira um nome para o treino.');
      return;
    }
    
    addWorkout({
      studentId: parseInt(selectedStudent),
      name: workoutName,
      exercises: exercises.map(ex => ({
        ...ex,
        name: exercisesData.find(e => e.id === parseInt(ex.exerciseId))?.name
      }))
    });
    
    // Reset form
    setWorkoutName('');
    setExercises([{ id: Date.now(), exerciseId: '', sets: 3, reps: '12', weight: '' }]);
    
    // Show Toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative">
      {/* Toast Notification */}
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
              <p className="text-sm text-green-50">Treino enviado para o App do Aluno!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 mt-1">Crie um plano de treino personalizado para seu aluno.</p>
        </div>
        
        <div className="flex gap-2">
          {WORKOUT_TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => loadTemplate(template.id)}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Workout Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Detalhes do Treino</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Aluno</label>
                  <select 
                    className="input-field"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Selecione um aluno...</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nome do Treino</label>
                  <input 
                    className="input-field"
                    placeholder="Ex: Hipertrofia A - Peito & Tríceps" 
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex flex-row items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900">Exercícios</h3>
              <button 
                onClick={addExercise} 
                className="text-accent hover:text-green-600 font-semibold flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Adicionar Exercício
              </button>
            </div>
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="flex flex-col md:flex-row gap-4 items-end p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-1 space-y-2 w-full">
                    <label className="text-xs font-medium text-slate-500">Exercício</label>
                    <select 
                      className="input-field text-sm"
                      value={exercise.exerciseId}
                      onChange={(e) => updateExercise(exercise.id, 'exerciseId', e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {exercisesData.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-full md:w-24 space-y-2">
                    <label className="text-xs font-medium text-slate-500">Séries</label>
                    <input 
                      type="number" 
                      className="input-field text-sm"
                      placeholder="4" 
                      value={exercise.sets}
                      onChange={(e) => updateExercise(exercise.id, 'sets', e.target.value)}
                    />
                  </div>

                  <div className="w-full md:w-32 space-y-2">
                    <label className="text-xs font-medium text-slate-500">Repetições</label>
                    <input 
                      className="input-field text-sm"
                      placeholder="12" 
                      value={exercise.reps}
                      onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                    />
                  </div>

                  <div className="w-full md:w-24 space-y-2">
                    <label className="text-xs font-medium text-slate-500">Peso (kg)</label>
                    <input 
                      type="number" 
                      className="input-field text-sm"
                      placeholder="20" 
                      value={exercise.weight}
                      onChange={(e) => updateExercise(exercise.id, 'weight', e.target.value)}
                    />
                  </div>

                  <button 
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
                    onClick={() => removeExercise(exercise.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}

              {exercises.length === 0 && (
                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                  <Dumbbell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Nenhum exercício adicionado ainda.</p>
                  <button onClick={addExercise} className="text-accent hover:underline mt-2">
                    Adicione seu primeiro exercício
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Summary/Actions */}
        <div className="space-y-6">
          <div className="card sticky top-24">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Resumo</h3>
            <div className="space-y-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total de Exercícios</span>
                  <span className="font-medium">{exercises.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duração Estimada</span>
                  <span className="font-medium">~{exercises.length * 5 + 10} min</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-lg shadow-lg shadow-accent/20" 
                  onClick={handleSave}
                >
                  <Save className="h-5 w-5" />
                  Salvar Treino
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
