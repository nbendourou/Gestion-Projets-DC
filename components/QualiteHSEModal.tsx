

// components/QualiteHSEModal.tsx

// Fix: Corrected the malformed import statement for React and hooks.
import React, { useState, useEffect } from 'react';
import type { QualiteHSE } from '../types.ts';

interface QualiteHSEModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: QualiteHSE) => void;
    item: QualiteHSE;
}

const QualiteHSEModal: React.FC<QualiteHSEModalProps> = ({ isOpen, onClose, onSave, item }) => {
    const [formData, setFormData] = useState<QualiteHSE>(() => item);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">{item?.typeDocument}</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                     <div>
                        <label htmlFor="statutFinal" className="block text-sm font-medium text-gray-300">Statut</label>
                        <select id="statutFinal" name="statutFinal" value={formData.statutFinal} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option>En cours</option>
                            <option>MAJ Requise</option>
                            <option>Clôturé</option>
                        </select>
                    </div>
                     <div className="flex items-center">
                        <input id="majSatisfaite" name="majSatisfaite" type="checkbox" checked={formData.majSatisfaite} onChange={handleChange} className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                        <label htmlFor="majSatisfaite" className="ml-2 block text-sm text-gray-300">Mise à jour satisfaite</label>
                    </div>
                     <div>
                        <label htmlFor="lienControleSigne" className="block text-sm font-medium text-gray-300">Lien vers le contrôle signé</label>
                        <input type="text" id="lienControleSigne" name="lienControleSigne" value={formData.lienControleSigne || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
                <div className="p-4 bg-gray-700/50 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Enregistrer</button>
                </div>
            </form>
        </div>
    );
};

export default QualiteHSEModal;