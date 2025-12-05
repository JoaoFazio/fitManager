import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useFitManager } from '../../context/FitManagerContext';

const StudentModal = ({ isOpen, onClose, studentToEdit }) => {
  const { addStudent, updateStudent } = useFitManager();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthdate: '',
    plan: 'Mensal',
    risk: 'low'
  });

  React.useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name || '',
        phone: studentToEdit.phone || studentToEdit.whatsapp || '',
        birthdate: studentToEdit.birthdate || '',
        plan: studentToEdit.plan || 'Mensal',
        risk: studentToEdit.risk || 'low'
      });
    } else {
      setFormData({ name: '', whatsapp: '', birthdate: '', plan: 'Mensal', risk: 'low' });
    }
  }, [studentToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentToEdit) {
      updateStudent(studentToEdit.id, formData);
    } else {
      addStudent(formData);
    }
    onClose();
    setFormData({ name: '', whatsapp: '', birthdate: '', plan: 'Mensal', risk: 'low' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={studentToEdit ? "Editar Aluno" : "Novo Aluno"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Nome Completo</label>
          <input 
            className="input-field"
            placeholder="Ex: João Silva" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">WhatsApp</label>
            <input 
              className="input-field"
              placeholder="(11) 99999-9999" 
              required 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Data de Nascimento</label>
            <input 
              type="date"
              className="input-field"
              required 
              value={formData.birthdate}
              onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Plano</label>
            <select 
              className="input-field"
              value={formData.plan}
              onChange={(e) => setFormData({...formData, plan: e.target.value})}
            >
              <option value="Mensal">Mensal</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Risco Inicial</label>
            <select 
              className="input-field"
              value={formData.risk}
              onChange={(e) => setFormData({...formData, risk: e.target.value})}
            >
              <option value="low">Baixo</option>
              <option value="medium">Médio</option>
              <option value="high">Alto</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button type="button" className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            {studentToEdit ? "Salvar Alterações" : "Salvar Aluno"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export { StudentModal };
