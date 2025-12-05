import React from 'react';
import { Modal } from '../ui/Modal';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function TransactionsModal({ isOpen, onClose, transactions }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Todas as Transações">
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${t.type === 'Income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {t.type === 'Income' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-medium text-slate-900">{t.student}</p>
                <p className="text-sm text-slate-500">{t.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${t.type === 'Income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {t.type === 'Income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {t.status === 'Paid' ? 'Pago' : 'Pendente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
