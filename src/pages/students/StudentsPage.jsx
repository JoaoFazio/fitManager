import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Trash2, Edit, Dumbbell } from 'lucide-react';
import { StudentModal } from '../../components/students/StudentModal';
import { useFitManager } from '../../context/FitManagerContext';

export default function StudentsPage() {
  const { students, deleteStudent, completeWorkout } = useFitManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [editingStudent, setEditingStudent] = useState(null);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      deleteStudent(id);
      setOpenMenuId(null);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-8" onClick={() => setOpenMenuId(null)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 mt-1">Gerencie os membros da sua academia e acompanhe o progresso.</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setEditingStudent(null); setIsModalOpen(true); }} 
          className="btn-primary flex items-center gap-2 shadow-lg shadow-accent/20"
        >
          <Plus className="h-4 w-4" />
          Novo Aluno
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Todos os Alunos</h3>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              placeholder="Buscar alunos..." 
              className="input-field pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Nome</th>
                  <th className="px-6 py-4 font-medium">Plano</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Risco de Churn</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full bg-slate-100" />
                        <div className="flex flex-col">
                          <span>{student.name}</span>
                          <span className="text-xs text-slate-400 font-normal">{student.phone || student.whatsapp || 'Sem telefone'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{student.plan}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {student.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        student.risk === 'low' ? 'bg-green-100 text-green-700' : 
                        student.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {student.risk === 'low' ? 'Baixo' : student.risk === 'medium' ? 'Médio' : 'Alto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === student.id ? null : student.id);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                      </button>
                      
                      {openMenuId === student.id && (
                        <div className="absolute right-8 top-8 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-10 overflow-hidden">
                            <button 
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); handleEdit(student); }}
                          >
                            <Edit className="h-4 w-4" /> Editar
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if(window.confirm(`Registrar treino para ${student.name}?`)) {
                                completeWorkout(student.id, null);
                                setOpenMenuId(null);
                                alert('Treino registrado com sucesso! O status do aluno foi atualizado.');
                              }
                            }}
                          >
                            <Dumbbell className="h-4 w-4" /> Registrar Treino
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }}
                          >
                            <Trash2 className="h-4 w-4" /> Excluir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Nenhum aluno encontrado</h3>
            <p className="text-slate-500 max-w-sm mt-1 mb-6">
              {searchTerm ? "Tente ajustar seus termos de busca." : "Comece adicionando seu primeiro aluno ao sistema."}
            </p>
            {!searchTerm && (
              <button 
                onClick={(e) => { e.stopPropagation(); setEditingStudent(null); setIsModalOpen(true); }} 
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Aluno
              </button>
            )}
          </div>
        )}
      </div>

      <StudentModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        studentToEdit={editingStudent}
      />
    </div>
  );
}
