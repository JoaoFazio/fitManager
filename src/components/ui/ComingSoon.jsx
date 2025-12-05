import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Card } from './Card';

export default function ComingSoon({ title = "Em Breve" }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
      <div className="bg-brand-accent/10 p-6 rounded-full mb-6">
        <Construction className="h-16 w-16 text-brand-accent" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500 max-w-md mb-8">
        Estamos trabalhando duro para trazer esta funcionalidade para você. Estará disponível na próxima atualização do FitManager Pro.
      </p>
      <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
    </div>
  );
}
