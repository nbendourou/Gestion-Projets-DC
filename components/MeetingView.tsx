
import React, { useState, useMemo } from 'react';
import type { Action, Contact, CriticiteAlerte as CriticiteAlerteType } from '../types.ts';
import { StatutKanban, TypeEvenement, CriticiteAlerte } from '../types.ts';
import JustificationModal from './JustificationModal.tsx';

interface MeetingViewProps {
    actions: Action[];
    contacts: Contact[];
    onSaveAction: (action: Action) => void;
    addHistoryEntry: (actionId: string, type: TypeEvenement, description: string) => void;
    projectId: string;
}

const MeetingView: React.FC<MeetingViewProps> = ({ actions, contacts, onSaveAction, addHistoryEntry, projectId }) => {
    // Filter states
    const [filterContactId, setFilterContactId] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterCriticite, setFilterCriticite] = useState<string>('');
    const [filterLot, setFilterLot] = useState<string>('');
    
    const [editingAction, setEditingAction] = useState<Action | null>(null);
    const [quickAddText, setQuickAddText] = useState('');

    const activeActions = useMemo(() => {
        return actions
            .filter(a => a.statutKanban !== StatutKanban.CLOTURE)
            .sort((a, b) => new Date(a.derniereLimite).getTime() - new Date(b.derniereLimite).getTime());
    }, [actions]);
    
    const uniqueLots = useMemo(() => Array.from(new Set(actions.map(a => a.lotTechnique))), [actions]);

    const filteredActions = useMemo(() => {
        let filtered = activeActions;
        if (filterContactId) {
            filtered = filtered.filter(a => a.respExecution === filterContactId || a.respValidationPpl === filterContactId);
        }
        if (filterStatus) {
            filtered = filtered.filter(a => a.statutKanban === filterStatus);
        }
        if (filterCriticite) {
            filtered = filtered.filter(a => a.criticiteAlerte === filterCriticite);
        }
        if (filterLot) {
            filtered = filtered.filter(a => a.lotTechnique === filterLot);
        }
        return filtered;
    }, [activeActions, filterContactId, filterStatus, filterCriticite, filterLot]);
    
    const resetFilters = () => {
        setFilterContactId('');
        setFilterStatus('');
        setFilterCriticite('');
        setFilterLot('');
    };

    const getContactById = (id: string) => contacts.find(c => c.id === id);

    const handleStatusChange = (action: Action, newStatus: StatutKanban) => {
        const oldStatus = action.statutKanban;
        if(oldStatus !== newStatus) {
            onSaveAction({ ...action, statutKanban: newStatus });
        }
    };
    
    const handleQuickAdd = () => {
        if (!quickAddText.trim()) return;

        let nomLivrable = quickAddText;
        let derniereLimite = new Date();
        let respExecutionId = '';

        // Parse date (JJ/MM/AAAA)
        const dateMatch = nomLivrable.match(/pour le (\d{2}\/\d{2}\/\d{4})/);
        if (dateMatch) {
            nomLivrable = nomLivrable.replace(dateMatch[0], '').trim();
            const [day, month, year] = dateMatch[1].split('/');
            derniereLimite = new Date(`${year}-${month}-${day}`);
        }

        // Parse user (@Prénom Nom)
        const userMatch = nomLivrable.match(/@([\w\s]+)/);
        if (userMatch) {
            nomLivrable = nomLivrable.replace(userMatch[0], '').trim();
            const contactName = userMatch[1].trim().toLowerCase();
            const foundContact = contacts.find(c => `${c.firstName} ${c.lastName}`.toLowerCase() === contactName);
            if (foundContact) {
                respExecutionId = foundContact.id;
            }
        }
        
        const newAction: Action = {
            id: `A${Date.now()}`,
            projectId,
            nomLivrable: nomLivrable,
            lotTechnique: 'GO/ARCHI',
            indiceVersion: 'A',
            respExecution: respExecutionId || contacts[0]?.id || '', // Default to first contact
            respValidationPpl: contacts[0]?.id || '', // Default to first contact
            dateLimiteInit: new Date().toISOString().split('T')[0],
            derniereLimite: derniereLimite.toISOString().split('T')[0],
            statutKanban: StatutKanban.A_SOUMETTRE,
            criticiteAlerte: CriticiteAlerte.NORMAL,
            causeGlissement: '',
            commentaireStatut: '',
        };
        onSaveAction(newAction);
        setQuickAddText('');
    };
    
    const handleSaveFromModal = (data: { justification: string; newDate: string; comment: string }) => {
        if (editingAction) {
            let actionToUpdate = { ...editingAction };
            let hasChanges = false;
    
            // 1. Handle date change
            if (data.newDate !== editingAction.derniereLimite) {
                actionToUpdate.derniereLimite = data.newDate;
                hasChanges = true;
                
                const oldDateStr = new Date(editingAction.derniereLimite).toLocaleDateString();
                const newDateStr = new Date(data.newDate).toLocaleDateString();
                const justificationText = data.justification.trim() 
                    ? `. Justification: ${data.justification.trim()}`
                    : '';
                
                addHistoryEntry(
                    editingAction.id, 
                    TypeEvenement.MODIFICATION_DATE, 
                    `Date modifiée du ${oldDateStr} au ${newDateStr}${justificationText}`
                );
            }
    
            // 2. Save action if it changed
            if (hasChanges) {
                onSaveAction(actionToUpdate);
            }
            
            // 3. Handle comment (always as a separate history entry)
            if (data.comment.trim()) {
                addHistoryEntry(editingAction.id, TypeEvenement.AJOUT_COMMENTAIRE, data.comment.trim());
            }
            
            setEditingAction(null);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <header className="mb-6">
                <h2 className="text-3xl font-bold text-white">Revue de Réunion</h2>
                <p className="text-gray-400 mt-1">Pilotez vos actions en temps réel.</p>
            </header>

            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                    <input 
                        type="text"
                        value={quickAddText}
                        onChange={(e) => setQuickAddText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                        placeholder="Ajouter une action rapide (ex: Tâche pour le JJ/MM/AAAA @Responsable)"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
                    />
                    <button onClick={handleQuickAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Ajouter</button>
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center">
                <select value={filterContactId} onChange={(e) => setFilterContactId(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
                    <option value="">Responsable (Tous)</option>
                    {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
                    <option value="">Statut (Tous)</option>
                    {Object.values(StatutKanban).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filterCriticite} onChange={(e) => setFilterCriticite(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
                    <option value="">Criticité (Toutes)</option>
                    {Object.values(CriticiteAlerte).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                 <select value={filterLot} onChange={(e) => setFilterLot(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
                    <option value="">Lot (Tous)</option>
                    {uniqueLots.map(lot => <option key={lot} value={lot}>{lot}</option>)}
                </select>
                <button onClick={resetFilters} className="text-sm text-blue-400 hover:underline">Réinitialiser</button>
            </div>
            
            <div className="flex-1 bg-gray-800/50 rounded-xl overflow-hidden">
                <div className="overflow-y-auto h-full">
                     <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Livrable</th>
                                <th scope="col" className="px-6 py-3">Responsable</th>
                                <th scope="col" className="px-6 py-3">Date Limite</th>
                                <th scope="col" className="px-6 py-3 w-48">Statut</th>
                            </tr>
                        </thead>
                         <tbody>
                            {filteredActions.map(action => {
                                const contact = getContactById(action.respExecution);
                                const isOverdue = new Date(action.derniereLimite) < new Date() && action.statutKanban !== StatutKanban.CLOTURE;
                                return (
                                <tr key={action.id} onClick={() => setEditingAction(action)} className="bg-gray-800 hover:bg-gray-700/60 border-b border-gray-700 cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-white">{action.nomLivrable}</td>
                                    <td className="px-6 py-4">{contact ? `${contact.firstName} ${contact.lastName}` : action.respExecution}</td>
                                    <td className={`px-6 py-4`}>
                                        <span className={`p-1 rounded w-32 ${isOverdue ? 'text-red-400 font-bold' : ''}`}>
                                            {new Date(action.derniereLimite).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={action.statutKanban} 
                                            onChange={(e) => handleStatusChange(action, e.target.value as StatutKanban)} 
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full bg-gray-700 border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                                        >
                                             {Object.values(StatutKanban).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                                );
                            })}
                             {filteredActions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">Aucune action active à afficher pour ce filtre.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {editingAction && (
                <JustificationModal
                    isOpen={!!editingAction}
                    onClose={() => setEditingAction(null)}
                    onSave={handleSaveFromModal}
                    actionName={editingAction.nomLivrable}
                    currentDate={editingAction.derniereLimite}
                />
            )}
        </div>
    );
};

export default MeetingView;
