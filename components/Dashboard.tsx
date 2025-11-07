import React from 'react';
import type { Action, Contact, Historique } from '../types.ts';
import { StatutKanban, CriticiteAlerte, CompanyRole, TypeEvenement } from '../types.ts';

interface DashboardProps {
    actions: Action[];
    contacts: Contact[];
    historique: Historique[];
    onRemind: (contact: Contact, action: Action) => void;
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

const ActivityLog: React.FC<{ historique: Historique[], actions: Action[], contacts: Contact[] }> = ({ historique, actions, contacts }) => {
    const recentHistory = historique.slice(0, 5);

    const getActionName = (id: string) => actions.find(a => a.id === id)?.nomLivrable || id;

    return (
        <div className="bg-gray-800/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Journal d'Activité Récente</h3>
            <div className="space-y-4">
                {recentHistory.map(log => (
                    <div key={log.id} className="flex items-start">
                        <span className="text-xl mr-4 mt-1">{getIconForEventType(log.typeEvenement)}</span>
                        <div>
                            <p className="text-sm text-gray-300">
                                <span className="font-bold text-white">{getActionName(log.idActionRef)}</span>: {log.evenementDetail}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(log.dateLog).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
                {recentHistory.length === 0 && <p className="text-gray-500">Aucune activité récente.</p>}
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ actions, contacts, historique, onRemind }) => {
    
    const overdueActions = actions.filter(a => new Date(a.derniereLimite) < new Date() && a.statutKanban !== StatutKanban.CLOTURE).length;
    const criticalAlerts = actions.filter(a => a.criticiteAlerte === CriticiteAlerte.RETARD_CRITIQUE || a.criticiteAlerte === CriticiteAlerte.NON_CONFORMITE_MAJEURE).length;
    const actionsToUpdate = actions.filter(a => a.statutKanban === StatutKanban.VALIDÉ_AVEC_OBSERVATION_VAO).length;
    const closedActions = actions.filter(a => a.statutKanban === StatutKanban.CLOTURE).length;

    const StatCard: React.FC<{ title: string; value: number | string; color: string }> = ({ title, value, color }) => (
        <div className={`bg-gray-800/50 p-6 rounded-xl border-l-4 ${color}`}>
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            <p className="text-4xl font-bold text-white mt-2">{value}</p>
        </div>
    );

    const getContactById = (id: string) => contacts.find(c => c.id === id);

    const alertableActions = actions.filter(a => 
        (new Date(a.derniereLimite) < new Date() && a.statutKanban !== StatutKanban.CLOTURE) ||
        a.criticiteAlerte === CriticiteAlerte.RETARD_CRITIQUE || 
        a.criticiteAlerte === CriticiteAlerte.NON_CONFORMITE_MAJEURE ||
        a.statutKanban === StatutKanban.VALIDÉ_AVEC_OBSERVATION_VAO
    );

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Tableau de Bord</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Actions en retard" value={overdueActions} color="border-red-500" />
                <StatCard title="Alertes Critiques" value={criticalAlerts} color="border-orange-500" />
                <StatCard title="Validé avec Obs. (VAO)" value={actionsToUpdate} color="border-yellow-500" />
                <StatCard title="Actions clôturées" value={closedActions} color="border-green-500" />
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-800/50 rounded-xl overflow-hidden">
                     <h3 className="text-xl font-semibold text-white p-6">Alertes PMO</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Livrable</th>
                                    <th scope="col" className="px-6 py-3">Responsable</th>
                                    <th scope="col" className="px-6 py-3">Date Limite</th>
                                    <th scope="col" className="px-6 py-3">Statut</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {alertableActions.map(action => {
                                const contact = getContactById(action.respExecution);
                                return (
                                     <tr key={action.id} className="bg-gray-800 hover:bg-gray-700/60 border-b border-gray-700">
                                         <td className="px-6 py-4 font-medium text-white">{action.nomLivrable}</td>
                                         <td className="px-6 py-4">{contact ? `${contact.firstName} ${contact.lastName}` : action.respExecution}</td>
                                         <td className="px-6 py-4 text-red-400">{new Date(action.derniereLimite).toLocaleDateString()}</td>
                                         <td className="px-6 py-4">{action.statutKanban}</td>
                                         <td className="px-6 py-4">
                                             {contact && (
                                                <button onClick={() => onRemind(contact, action)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs">
                                                    Relancer
                                                </button>
                                             )}
                                         </td>
                                     </tr>
                                 )
                            })}
                            </tbody>
                        </table>
                         {alertableActions.length === 0 && <p className="text-center text-gray-500 py-8">Aucune alerte à afficher.</p>}
                     </div>
                </div>
                 <div className="lg:col-span-1">
                    <ActivityLog historique={historique} actions={actions} contacts={contacts} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;