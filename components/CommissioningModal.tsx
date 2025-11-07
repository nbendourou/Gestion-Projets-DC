

// components/CommissioningModal.tsx

// Fix: Corrected the malformed import statement for React and hooks.
import React, { useState, useEffect } from 'react';
import type { Commissioning } from '../types.ts';

interface CommissioningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Commissioning) => void;
    item: Commissioning;
}

const CommissioningModal: React.FC<CommissioningModalProps> = ({ isOpen, onClose, onSave, item }) => {
    const [formData, setFormData] = useState<Commissioning>(() => item);

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
                    <h2 className="text-2xl font-bold text-white">Jalon: {item?.jalonCx}</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="datePrevue" className="block text-sm font-medium text-gray-300">Date Prévue</label>
                        <input type="date" id="datePrevue" name="datePrevue" value={formData.datePrevue} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                     <div>
                        <label htmlFor="dateReelle" className="block text-sm font-medium text-gray-300">Date Réelle</label>
                        <input type="date" id="dateReelle" name="dateReelle" value={formData.dateReelle || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                     <div className="flex items-center pt-6">
                        <input id="scriptsValide" name="scriptsValide" type="checkbox" checked={formData.scriptsValide} onChange={handleChange} className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                        <label htmlFor="scriptsValide" className="ml-2 block text-sm text-gray-300">Scripts Validés</label>
                    </div>
                    <div className="pt-1">
                         <label htmlFor="materielEtalonnage" className="block text-sm font-medium text-gray-300">Matériel Étalonné</label>
                        <input type="text" id="materielEtalonnage" name="materielEtalonnage" value={formData.materielEtalonnage || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="statutDoe" className="block text-sm font-medium text-gray-300">Statut DOE</label>
                        <select id="statutDoe" name="statutDoe" value={formData.statutDoe} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                           <option>À Soumettre</option>
                           <option>En Revue</option>
                           <option>Clôturé</option>
                        </select>
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

export default CommissioningModal;