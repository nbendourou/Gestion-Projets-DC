import React, { useMemo, useState } from 'react';
import type { NonConformiteMineure, Action, Contact } from '../types.ts';
import NonConformiteModal from './NonConformiteModal.tsx';

interface NonConformitesViewProps {
    nonConformites: NonConformiteMineure[];
    actions: Action[];
    contacts: Contact[];
    onSaveNonConformite: (item: NonConformiteMineure) => void;
}

const NonConformitesView: React.FC<NonConformitesViewProps> = ({ nonConformites, actions, contacts, onSaveNonConformite }) => {
    const [editingItem, setEditingItem] = useState<NonConformiteMineure | null>(null);

    const actionsMap = useMemo(() => {
        return new Map(actions.map(action => [action.id, action.nomLivrable]));
    }, [actions]);

    const handleSave = (item: NonConformiteMineure) => {
        onSaveNonConformite(item);
        setEditingItem(null);
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-3xl font-bold text-white mb-6">Suivi des Non-Conformités Mineures</h2>
            <div className="flex-1 bg-gray-800/50 rounded-xl overflow-hidden">
                <div className="overflow-auto h-full">
                    <table className="w-full text-sm text-left text-gray-300 table-fixed">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-1/4">Action Associée</th>
                                <th scope="col" className="px-6 py-3 w-[15%]">Type</th>
                                <th scope="col" className="px-6 py-3 w-1/3">Description</th>
                                <th scope="col" className="px-6 py-3 w-[12%]">Responsable</th>
                                <th scope="col" className="px-6 py-3 w-[10%]">Date Constat</th>
                                <th scope="col" className="px-6 py-3 w-[10%]">Statut</th>
                                <th scope="col" className="px-6 py-3 w-[10%]">Date Clôture</th>
                                <th scope="col" className="px-6 py-3 w-[8%]"><span className="sr-only">Modifier</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {nonConformites.length > 0 ? nonConformites.map(nc => (
                                <tr key={nc.id} onClick={() => setEditingItem(nc)} className="bg-gray-800 hover:bg-gray-700/60 border-b border-gray-700 transition-colors cursor-pointer">
                                    <td scope="row" className="px-6 py-4 font-medium text-white truncate" title={actionsMap.get(nc.idActionRef) || nc.idActionRef}>
                                        {actionsMap.get(nc.idActionRef) || nc.idActionRef}
                                    </td>
                                    <td className="px-6 py-4 truncate">{nc.typeNonConformite}</td>
                                    <td className="px-6 py-4 truncate" title={nc.description}>{nc.description}</td>
                                    <td className="px-6 py-4 truncate">{contacts.find(c => c.id === nc.respAction)?.lastName || nc.respAction}</td>
                                    <td className="px-6 py-4">{new Date(nc.dateConstat).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${nc.statut === 'Ouverte' ? 'bg-yellow-500/30 text-yellow-200' : 'bg-green-500/30 text-green-200'}`}>
                                            {nc.statut}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{nc.dateCloture ? new Date(nc.dateCloture).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="font-medium text-blue-400 hover:text-blue-300">Modifier</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-10 text-gray-500">Aucune non-conformité mineure enregistrée.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {editingItem && (
                <NonConformiteModal
                    isOpen={!!editingItem}
                    onClose={() => setEditingItem(null)}
                    onSave={handleSave}
                    item={editingItem}
                    contacts={contacts}
                />
            )}
        </div>
    );
};

export default NonConformitesView;