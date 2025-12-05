import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useFitManager } from '../../context/FitManagerContext';

const ClassModal = ({ isOpen, onClose }) => {
  const { addClass } = useFitManager();
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    type: 'Strength',
    date: '',
    time: '',
    duration: '60',
    capacity: '20',
    day: 'Monday' // Default, logic to derive day from date can be added
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple logic to get day name from date
    const dateObj = new Date(formData.date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dateObj.getDay() + 1] || 'Monday'; // +1 adjustment might be needed depending on timezone/parsing, keeping simple for now or letting user select day if we added a dropdown. 
    // Actually, let's trust the date picker or just default to Monday for prototype if date parsing is tricky without a library like date-fns. 
    // Better: Let's explicitly add a Day selector or infer it. 
    // For this prototype, let's just infer it from the date string.
    
    // Fix: getDay() returns 0-6 (Sun-Sat). 
    // Creating date from "YYYY-MM-DD" string treats it as UTC usually, which might shift day.
    // Let's just append "T12:00:00" to ensure we get the right day roughly.
    const derivedDay = new Date(formData.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });

    addClass({
      ...formData,
      day: derivedDay,
      duration: `${formData.duration} min`,
      capacity: parseInt(formData.capacity)
    });
    
    onClose();
    setFormData({
      title: '',
      instructor: '',
      type: 'Strength',
      date: '',
      time: '',
      duration: '60',
      capacity: '20',
      day: 'Monday'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule New Class">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Class Title</label>
          <Input name="title" value={formData.title} onChange={handleChange} placeholder="Ex: Advanced CrossFit" required />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Instructor</label>
            <Input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Instructor Name" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Type</label>
            <select 
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Yoga">Yoga</option>
              <option value="Pilates">Pilates</option>
              <option value="CrossFit">CrossFit</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Date</label>
            <Input name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Time</label>
            <Input name="time" type="time" value={formData.time} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Duration (min)</label>
            <Input name="duration" type="number" value={formData.duration} onChange={handleChange} placeholder="60" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Capacity</label>
            <Input name="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="20" required />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-primary hover:bg-brand-primary/90">
            Schedule Class
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { ClassModal };
