

// components/EchantillonModal.tsx

// Fix: Corrected the malformed import statement for React and hooks.
import React, { useState, useEffect } from 'react';
import type { Echantillon } from '../types.ts';

interface EchantillonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Echantillon) => void;
    item: Echantillon;
}

const EchantillonModal: React.FC<EchantillonModalProps> = ({ isOpen, onClose, onSave, item }) => {
    const [formData, setFormData] = useState<Echantillon>(() => item);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
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
                    <h2 className="text-2xl font-bold text-white">Échantillon: {item?.nomProduit}</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="statutValidation" className="block text-sm font-medium text-gray-300">Statut de Validation</label>
                        <select id="statutValidation" name="statutValidation" value={formData.statutValidation} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                           <option>Validé Avec Observation (VAO)</option>
                           <option>Validé Sans Observation (VSO)</option>
                           <option>Refusé</option>
                           <option>À Livrer</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="conformiteCoupeFeu" className="block text-sm font-medium text-gray-300">Conformité Coupe-Feu</label>
                        <input type="text" id="conformiteCoupeFeu" name="conformiteCoupeFeu" value={formData.conformiteCoupeFeu || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="lienCertificat" className="block text-sm font-medium text-gray-300">Lien vers le certificat</label>
                        <input type="text" id="lienCertificat" name="lienCertificat" value={formData.lienCertificat || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
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

export default EchantillonModal;