import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ClassModal } from '../../components/schedule/ClassModal';
import { useFitManager } from '../../context/FitManagerContext';
import { Plus, Calendar, Clock, Users, MapPin } from 'lucide-react';

export default function SchedulePage() {
  const { classes } = useFitManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daysTranslated = {
    'Monday': 'Segunda',
    'Tuesday': 'Terça',
    'Wednesday': 'Quarta',
    'Thursday': 'Quinta',
    'Friday': 'Sexta',
    'Saturday': 'Sábado',
    'Sunday': 'Domingo'
  };
  
  const filteredClasses = classes.filter(cls => cls.day === selectedDay);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500">Gerencie a agenda semanal de aulas da sua academia.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-brand-accent hover:bg-green-500 text-slate-900 font-bold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agendar Aula
        </Button>
      </div>

      {/* Day Selector */}
      <div className="flex overflow-x-auto pb-2 gap-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedDay === day 
                ? 'bg-brand-primary text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {daysTranslated[day]}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <Card key={cls.id} className="hover:shadow-md transition-shadow border-l-4 border-l-brand-accent">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2">{cls.type}</Badge>
                  <Badge variant={cls.enrolled >= cls.capacity ? 'danger' : 'success'}>
                    {cls.enrolled}/{cls.capacity}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{cls.title}</CardTitle>
                <p className="text-sm text-slate-500 font-medium">com {cls.instructor}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>{cls.time} ({cls.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>{cls.capacity - cls.enrolled} vagas restantes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>Estúdio Principal</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                  <Button variant="secondary" size="sm" className="w-full">Editar</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Nenhuma aula agendada para {daysTranslated[selectedDay]}</p>
            <Button variant="link" onClick={() => setIsModalOpen(true)} className="text-brand-accent mt-2">
              Agendar uma aula agora
            </Button>
          </div>
        )}
      </div>

      <ClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
