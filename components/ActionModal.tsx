

import React, { useState, useEffect } from 'react';
// Fix: Added .ts extension to types import.
import type { Action, Contact, Historique } from '../types.ts';
// Fix: Added .ts extension to types import.
import { StatutKanban, CriticiteAlerte, TypeEvenement } from '../types.ts';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (action: Action) => void;
    action: Action | null;
    contacts: Contact[];
    historique: Historique[];
    defaultStatus?: StatutKanban;
    projectId: string;
}

const getNewAction = (projectId: string, defaultStatus?: StatutKanban): Omit<Action, 'id'> => ({
    projectId,
    nomLivrable: '',
    lotTechnique: 'GO/ARCHI',
    indiceVersion: 'A',
    respExecution: '',
    respValidationPpl: '',
    dateLimiteInit: new Date().toISOString().split('T')[0],
    derniereLimite: new Date().toISOString().split('T')[0],
    statutKanban: defaultStatus || StatutKanban.A_SOUMETTRE,
    criticiteAlerte: CriticiteAlerte.NORMAL,
    causeGlissement: '',
    commentaireStatut: '',
    lienDriveDoc: '',
    lienFicheVisa: '',
});

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, onSave, action, contacts, historique, defaultStatus, projectId }) => {
    const [formData, setFormData] = useState(() => action ? { ...action } : getNewAction(projectId, defaultStatus));

    useEffect(() => {
        if (isOpen) {
            setFormData(action ? { ...action } : getNewAction(projectId, defaultStatus));
        }
    }, [action, defaultStatus, isOpen, projectId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.respExecution || !formData.respValidationPpl) {
            alert('Veuillez assigner les responsables.');
            return;
        }
        const finalAction = action 
            ? formData
            : { ...formData, id: `A${Date.now()}` };
        
        onSave(finalAction as Action);
    };

    if (!isOpen) return null;

    const actionHistory = historique.filter(h => h.idActionRef === action?.id).sort((a,b) => new Date(b.dateLog).getTime() - new Date(a.dateLog).getTime());
    
    const getIconForEventType = (type: TypeEvenement) => {
        switch (type) {
            case TypeEvenement.CREATION: return '✨';
            case TypeEvenement.CHANGEMENT_STATUT: return '🏷️';
            case TypeEvenement.MODIFICATION_DATE: return '🗓️';
            case TypeEvenement.CHANGEMENT_RESPONSABLE: return '👤';
            case TypeEvenement.AJOUT_COMMENTAIRE: return '💬';
            default: return '✏️';
        }
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">{action ? 'Modifier' : 'Ajouter'} une Action</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
                    <div className="lg:col-span-2 space-y-4">
                        <div>
                            <label htmlFor="nomLivrable" className="block text-sm font-medium text-gray-300">Nom du Livrable</label>
                            <input type="text" id="nomLivrable" name="nomLivrable" value={formData.nomLivrable} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Form fields */}
                            {/* ... similar input fields for other properties */}
                            <div>
                                <label htmlFor="statutKanban" className="block text-sm font-medium text-gray-300">Statut</label>
                                <select id="statutKanban" name="statutKanban" value={formData.statutKanban} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    {Object.values(StatutKanban).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="criticiteAlerte" className="block text-sm font-medium text-gray-300">Criticité</label>
                                <select id="criticiteAlerte" name="criticiteAlerte" value={formData.criticiteAlerte} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    {Object.values(CriticiteAlerte).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="respExecution" className="block text-sm font-medium text-gray-300">Resp. Exécution</label>
                                <select id="respExecution" name="respExecution" value={formData.respExecution} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Sélectionner...</option>
                                    {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.companyRole})</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="respValidationPpl" className="block text-sm font-medium text-gray-300">Resp. Validation</label>
                                <select id="respValidationPpl" name="respValidationPpl" value={formData.respValidationPpl} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Sélectionner...</option>
                                    {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.companyRole})</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="derniereLimite" className="block text-sm font-medium text-gray-300">Date Limite</label>
                                <input type="date" id="derniereLimite" name="derniereLimite" value={formData.derniereLimite} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="commentaireStatut" className="block text-sm font-medium text-gray-300">Commentaire</label>
                            <textarea id="commentaireStatut" name="commentaireStatut" rows={3} value={formData.commentaireStatut || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                    </div>
                    <div className="lg:col-span-1 bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-600 pb-2 mb-4">Historique</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                             {actionHistory.map(log => (
                                <div key={log.id} className="flex items-start">
                                    <span className="text-xl mr-3 mt-1">{getIconForEventType(log.typeEvenement)}</span>
                                    <div>
                                        <p className="text-sm text-gray-300">{log.evenementDetail}</p>
                                        <p className="text-xs text-gray-500">{new Date(log.dateLog).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            {actionHistory.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Aucun historique.</p>}
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-700 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Enregistrer</button>
                </div>
            </form>
        </div>
    );
};

export default ActionModal;
