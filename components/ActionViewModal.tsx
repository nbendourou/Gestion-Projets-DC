import React from 'react';
// Fix: Added .ts extension to types import.
import type { Action, Contact, Historique } from '../types.ts';
// Fix: Added .ts extension to types import.
import { TypeEvenement } from '../types.ts';

interface ActionViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: Action | null;
    contacts: Contact[];
    historique: Historique[];
}

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

const DetailItem: React.FC<{ label: string; value: string | React.ReactNode; fullWidth?: boolean }> = ({ label, value, fullWidth }) => (
    <div className={fullWidth ? 'col-span-2' : ''}>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-md text-white font-semibold">{value}</p>
    </div>
);

const ActionViewModal: React.FC<ActionViewModalProps> = ({ isOpen, onClose, action, contacts, historique }) => {
    if (!isOpen || !action) return null;
    
    const getContactName = (id: string) => {
        const contact = contacts.find(c => c.id === id);
        return contact ? `${contact.firstName} ${contact.lastName}` : id;
    };
    
    const actionHistory = historique.filter(h => h.idActionRef === action.id).sort((a,b) => new Date(b.dateLog).getTime() - new Date(a.dateLog).getTime());

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Détails de l'Action</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-y-auto">
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-600 pb-2">{action.nomLivrable}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Lot Technique" value={action.lotTechnique} />
                            <DetailItem label="Indice de Version" value={action.indiceVersion} />
                            <DetailItem label="Responsable Exécution" value={getContactName(action.respExecution)} />
                            <DetailItem label="Responsable Validation" value={getContactName(action.respValidationPpl)} />
                            <DetailItem label="Statut Kanban" value={action.statutKanban} />
                            <DetailItem label="Criticité / Alerte" value={action.criticiteAlerte} />
                            <DetailItem label="Date Limite Initiale" value={new Date(action.dateLimiteInit).toLocaleDateString()} />
                            <DetailItem label="Date Limite" value={new Date(action.derniereLimite).toLocaleDateString()} />
                             <DetailItem label="Lien Document" value={action.lienDriveDoc ? <a href={action.lienDriveDoc} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ouvrir</a> : 'N/A'} />
                             <DetailItem label="Lien Fiche VISA" value={action.lienFicheVisa ? <a href={action.lienFicheVisa} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ouvrir</a> : 'N/A'} />
                            <DetailItem label="Cause du Glissement" value={action.causeGlissement || 'N/A'} fullWidth />
                            <DetailItem label="Commentaire" value={action.commentaireStatut || 'N/A'} fullWidth />
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-600 pb-2 mb-4">Historique de l'Action</h3>
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
                            {actionHistory.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Aucun historique pour cette action.</p>}
                        </div>
                    </div>
                </div>
                 <div className="p-4 border-t border-gray-700 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg">Fermer</button>
                </div>
            </div>
        </div>
    );
};

export default ActionViewModal;