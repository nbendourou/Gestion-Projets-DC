

import React, { useState, useMemo } from 'react';
import type { Action, Contact, Historique, CriticiteAlerte as CriticiteAlerteType } from '../types.ts';
import { StatutKanban, CriticiteAlerte } from '../types.ts';
import { KANBAN_COLUMNS } from '../constants.ts';
import KanbanCard from './KanbanCard.tsx';
import ActionModal from './ActionModal.tsx';
import ActionViewModal from './ActionViewModal.tsx';
import ConfirmationModal from './ConfirmationModal.tsx';

interface KanbanBoardProps {
    actions: Action[];
    contacts: Contact[];
    historique: Historique[];
    onSaveAction: (action: Action) => void;
    onDeleteAction: (actionId: string) => void;
    // Fix: Accept projectId and pass it down to ActionModal for new action creation.
    projectId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ actions, contacts, historique, onSaveAction, onDeleteAction, projectId }) => {
    // state for modals
    const [viewAction, setViewAction] = useState<Action | null>(null);
    const [editAction, setEditAction] = useState<Action | null>(null);
    const [isNewActionModalOpen, setIsNewActionModalOpen] = useState(false);
    const [defaultStatusForNew, setDefaultStatusForNew] = useState<StatutKanban | undefined>();
    const [actionToDelete, setActionToDelete] = useState<string | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRespExec, setFilterRespExec] = useState('');
    const [filterRespValid, setFilterRespValid] = useState('');
    const [filterLot, setFilterLot] = useState('');
    const [filterCriticite, setFilterCriticite] = useState<CriticiteAlerteType[]>([]);
    const [filterEchues, setFilterEchues] = useState(false);
    const [isCriticiteOpen, setIsCriticiteOpen] = useState(false);

    const filteredActions = useMemo(() => {
        let filtered = actions;

        if (searchQuery) {
            filtered = filtered.filter(a => a.nomLivrable.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (filterRespExec) {
            filtered = filtered.filter(a => a.respExecution === filterRespExec);
        }
        if (filterRespValid) {
            filtered = filtered.filter(a => a.respValidationPpl === filterRespValid);
        }
        if (filterLot) {
            filtered = filtered.filter(a => a.lotTechnique === filterLot);
        }
        if (filterCriticite.length > 0) {
            filtered = filtered.filter(a => filterCriticite.includes(a.criticiteAlerte));
        }
        if (filterEchues) {
            filtered = filtered.filter(a => new Date(a.derniereLimite) < new Date() && a.statutKanban !== StatutKanban.CLOTURE);
        }

        return filtered;
    }, [actions, searchQuery, filterRespExec, filterRespValid, filterLot, filterCriticite, filterEchues]);

    const resetFilters = () => {
        setSearchQuery('');
        setFilterRespExec('');
        setFilterRespValid('');
        setFilterLot('');
        setFilterCriticite([]);
        setFilterEchues(false);
    };
    
     const handleCriticiteChange = (criticite: CriticiteAlerteType) => {
        setFilterCriticite(prev =>
            prev.includes(criticite) ? prev.filter(c => c !== criticite) : [...prev, criticite]
        );
    };

    // D&D handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, actionId: string) => {
        e.dataTransfer.setData("actionId", actionId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: StatutKanban) => {
        e.preventDefault();
        const actionId = e.dataTransfer.getData("actionId");
        const actionToMove = actions.find(a => a.id === actionId);
        if (actionToMove && actionToMove.statutKanban !== newStatus) {
            onSaveAction({ ...actionToMove, statutKanban: newStatus });
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleOpenNewActionModal = (status: StatutKanban) => {
        setDefaultStatusForNew(status);
        setEditAction(null);
        setIsNewActionModalOpen(true);
    };
    
    const handleEdit = (action: Action) => {
        setDefaultStatusForNew(undefined);
        setEditAction(action);
        setIsNewActionModalOpen(true);
    };

    const handleSave = (action: Action) => {
        onSaveAction(action);
        setEditAction(null);
        setIsNewActionModalOpen(false);
    };

    const handleDeleteRequest = (actionId: string) => {
        setActionToDelete(actionId);
    };

    const handleConfirmDelete = () => {
        if (actionToDelete) {
            onDeleteAction(actionToDelete);
            setActionToDelete(null);
        }
    };

    const closeModal = () => {
        setViewAction(null);
        setEditAction(null);
        setIsNewActionModalOpen(false);
    };

    const uniqueLots = useMemo(() => Array.from(new Set(actions.map(a => a.lotTechnique))), [actions]);

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-3xl font-bold text-white mb-6">Kanban - Suivi des Livrables</h2>
            
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input type="text" placeholder="Rechercher par nom..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500" />
                    <select value={filterRespExec} onChange={e => setFilterRespExec(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500">
                        <option value="">Resp. Exécution (Tous)</option>
                        {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                    </select>
                     <select value={filterRespValid} onChange={e => setFilterRespValid(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500">
                        <option value="">Resp. Validation (Tous)</option>
                        {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                    </select>
                    <select value={filterLot} onChange={e => setFilterLot(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500">
                        <option value="">Lot (Tous)</option>
                        {uniqueLots.map(lot => <option key={lot} value={lot}>{lot}</option>)}
                    </select>
                     <div className="relative">
                        <button onClick={() => setIsCriticiteOpen(!isCriticiteOpen)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-left flex justify-between items-center">
                            <span>{filterCriticite.length > 0 ? `${filterCriticite.length} criticités` : 'Criticité (Toutes)'}</span>
                            <span>▼</span>
                        </button>
                        {isCriticiteOpen && (
                             <div className="absolute top-full left-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-20 border border-gray-600" onMouseLeave={() => setIsCriticiteOpen(false)}>
                                {Object.values(CriticiteAlerte).map(c => (
                                    <label key={c} className="flex items-center px-4 py-2 hover:bg-gray-600">
                                        <input type="checkbox" checked={filterCriticite.includes(c)} onChange={() => handleCriticiteChange(c)} className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-blue-600 focus:ring-blue-500"/>
                                        <span className="ml-3 text-sm text-gray-200">{c}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-gray-300">
                        <input type="checkbox" checked={filterEchues} onChange={e => setFilterEchues(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2">Échues seulement</span>
                    </label>
                    <button onClick={resetFilters} className="text-sm text-blue-400 hover:underline">Réinitialiser</button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
                {KANBAN_COLUMNS.map(column => {
                    const columnActions = filteredActions.filter(a => a.statutKanban === column);
                    return (
                        <div 
                            key={column}
                            className="bg-gray-800/50 rounded-lg p-4 flex flex-col min-h-[300px] min-w-[230px]"
                            onDrop={(e) => handleDrop(e, column)}
                            onDragOver={handleDragOver}
                        >
                            <div className="flex justify-between items-center mb-4 px-1">
                               <h3 className="font-semibold text-white">{column} <span className="text-gray-400 text-sm">({columnActions.length})</span></h3>
                                <button onClick={() => handleOpenNewActionModal(column)} className="text-gray-400 hover:text-white text-xl font-bold">+</button>
                            </div>
                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2">
                                {columnActions.map(action => (
                                    <div 
                                        key={action.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, action.id)}
                                    >
                                        <KanbanCard 
                                            action={action}
                                            contacts={contacts}
                                            onView={setViewAction}
                                            onEdit={() => handleEdit(action)}
                                            onDelete={handleDeleteRequest}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {(isNewActionModalOpen || editAction) && (
                 <ActionModal
                    key={editAction?.id || 'new'}
                    isOpen={isNewActionModalOpen || !!editAction}
                    onClose={closeModal}
                    onSave={handleSave}
                    action={editAction}
                    contacts={contacts}
                    historique={historique}
                    defaultStatus={defaultStatusForNew}
                    projectId={projectId}
                />
            )}
           
            {viewAction && (
                <ActionViewModal
                    isOpen={!!viewAction}
                    onClose={() => setViewAction(null)}
                    action={viewAction}
                    contacts={contacts}
                    historique={historique}
                />
            )}

            {actionToDelete && (
                <ConfirmationModal 
                    isOpen={!!actionToDelete}
                    onClose={() => setActionToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Confirmer la suppression"
                    message="Êtes-vous sûr de vouloir supprimer cette action ? Cette action est irréversible."
                />
            )}
        </div>
    );
};

export default KanbanBoard;