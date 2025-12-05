import React from 'react';
import { ChevronLeft, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-slate-600" />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Termos e Privacidade</h1>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Intro Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Política de Privacidade</h2>
              <p className="text-xs text-slate-500">Última atualização: 25/11/2025</p>
            </div>
          </div>
          <div className="prose prose-sm text-slate-600">
            <p>
              A sua privacidade é importante para nós. É política do FitManager respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no aplicativo.
            </p>
            <h3 className="text-slate-900 font-bold mt-4 mb-2">1. Coleta de Dados</h3>
            <p>
              Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
            </p>
            <h3 className="text-slate-900 font-bold mt-4 mb-2">2. Uso de Dados no Ranking (TV)</h3>
            <p>
              Para fins de gamificação, seu nome, foto de perfil e pontuação de treinos podem ser exibidos no ranking da academia (Modo TV).
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
              <p className="text-yellow-800 text-xs font-medium">
                Você pode optar por não aparecer no ranking a qualquer momento acessando: <strong>Perfil {' > '} Configurações {' > '} Privacidade</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Termos de Uso</h2>
            </div>
          </div>
          <div className="prose prose-sm text-slate-600">
            <h3 className="text-slate-900 font-bold mt-4 mb-2">1. Aceitação dos Termos</h3>
            <p>
              Ao acessar ao FitManager, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis.
            </p>
            <h3 className="text-slate-900 font-bold mt-4 mb-2">2. Uso da Licença</h3>
            <p>
              É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no aplicativo FitManager, apenas para visualização transitória pessoal e não comercial.
            </p>
            <h3 className="text-slate-900 font-bold mt-4 mb-2">3. Isenção de Responsabilidade</h3>
            <p>
              Os materiais no aplicativo FitManager são fornecidos 'como estão'. FitManager não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          FitManager © 2025 - Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
