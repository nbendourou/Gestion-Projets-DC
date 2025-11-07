
import React, { useState } from 'react';

interface JustificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { justification: string; newDate: string; comment: string }) => void;
    actionName: string;
    currentDate: string;
}

const JustificationModal: React.FC<JustificationModalProps> = ({ isOpen, onClose, onSave, actionName, currentDate }) => {
    const [justification, setJustification] = useState('');
    const [newDate, setNewDate] = useState(currentDate);
    const [reason, setReason] = useState('');
    const [comment, setComment] = useState('');

    const commonReasons = [
        "Attente de prérequis d'une autre tâche",
        "Manque d'information de la part du client/BET",
        "Problème de ressource interne",
        "Complexité technique sous-estimée",
        "Modification de périmètre demandée",
    ];

    const handleSave = () => {
        if (newDate) {
            onSave({ justification, newDate, comment });
            setJustification('');
            setReason('');
            setComment('');
        }
    };

    const handleReasonClick = (selectedReason: string) => {
        setReason(selectedReason);
        setJustification(current => current ? `${current}\n- ${selectedReason}` : `- ${selectedReason}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white truncate max-w-md">Commenter / Justifier: {actionName}</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Causes fréquentes de retard</label>
                        <div className="space-y-2">
                            {commonReasons.map(r => (
                                <button key={r} onClick={() => handleReasonClick(r)} className="w-full text-left text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-2 rounded-md transition-colors">
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                             <label htmlFor="newDate" className="block text-sm font-medium text-gray-300">Nouvelle date limite</label>
                             <input
                                type="date"
                                id="newDate"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="justification" className="block text-sm font-medium text-gray-300">Justification du retard</label>
                            <textarea
                                id="justification"
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                                rows={4}
                                placeholder="Expliquer la cause du glissement..."
                                className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
                 <div className="px-6 pb-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-300">Commentaire additionnel</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        placeholder="Ajouter une note, une décision, un point de suivi..."
                        className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="p-4 bg-gray-700/50 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg">
                        Annuler
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JustificationModal;
