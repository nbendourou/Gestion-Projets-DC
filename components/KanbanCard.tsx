

import React, { useState } from 'react';
// Fix: Added .ts extension to types import.
import type { Action, Contact } from '../types.ts';
// Fix: Added .ts extension to types import.
import { CriticiteAlerte, StatutKanban } from '../types.ts';

interface KanbanCardProps {
    action: Action;
    contacts: Contact[];
    onView: (action: Action) => void;
    onEdit: (action: Action) => void;
    onDelete: (actionId: string) => void;
}

const getCriticiteColor = (criticite: CriticiteAlerte) => {
    switch (criticite) {
        case CriticiteAlerte.RETARD_CRITIQUE:
        case CriticiteAlerte.NON_CONFORMITE_MAJEURE:
            return 'border-red-500';
        case CriticiteAlerte.VIGILANCE:
            return 'border-orange-500';
        default:
            return 'border-transparent';
    }
};

const getLotTechniqueColor = (lot: string) => {
    switch (lot) {
        case 'CFO/CFA':
            return 'bg-sky-500';
        case 'FLUIDE/CVC':
            return 'bg-teal-500';
        case 'GO/ARCHI':
            return 'bg-amber-500';
        case 'SSI':
            return 'bg-rose-500';
        case 'Structure':
            return 'bg-indigo-500';
        default:
            return 'bg-slate-500';
    }
};


const KanbanCard: React.FC<KanbanCardProps> = ({ action, contacts, onView, onEdit, onDelete }) => {
    const responsibleContact = contacts.find(c => c.id === action.respExecution);
    const isOverdue = new Date(action.derniereLimite) < new Date() && action.statutKanban !== StatutKanban.CLOTURE;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div 
            className={`bg-gray-800 rounded-lg shadow-md hover:bg-gray-700/80 transition-all border-l-4 ${getCriticiteColor(action.criticiteAlerte)} overflow-hidden relative`}
        >
            <div className={`h-1.5 ${getLotTechniqueColor(action.lotTechnique)}`}></div>
            <div className="p-4" onClick={() => onView(action)}>
                <h4 className="font-bold text-white text-sm mb-2 pr-6">{action.nomLivrable}</h4>
                <p className="text-xs text-gray-400 mb-1">Lot: {action.lotTechnique}</p>
                <p className="text-xs text-gray-400 mb-2">Version: {action.indiceVersion}</p>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                    <div className="text-xs text-gray-400">
                        <p>Resp: {responsibleContact ? `${responsibleContact.firstName.charAt(0)}. ${responsibleContact.lastName}` : 'N/A'}</p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${isOverdue ? 'bg-red-500/30 text-red-300' : 'bg-gray-600 text-gray-300'}`}>
                        {new Date(action.derniereLimite).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <div className="absolute top-2 right-2">
                 <button 
                    onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                    onBlur={() => setTimeout(() => setIsMenuOpen(false), 200)}
                    className="w-6 h-6 rounded-full hover:bg-gray-600 flex items-center justify-center text-gray-400"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-gray-700 rounded-md shadow-lg z-10">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(action); setIsMenuOpen(false); }} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                        >
                            Modifier
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(action.id); setIsMenuOpen(false); }} 
                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                        >
                            Supprimer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanCard;