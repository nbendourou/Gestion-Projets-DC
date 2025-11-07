import React, { useState, useEffect } from 'react';
import type { NonConformiteMineure, Contact } from '../types.ts';

interface NonConformiteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: NonConformiteMineure) => void;
    item: NonConformiteMineure;
    contacts: Contact[];
}

const NonConformiteModal: React.FC<NonConformiteModalProps> = ({ isOpen, onClose, onSave, item, contacts }) => {
    const [formData, setFormData] = useState<NonConformiteMineure>(() => ({ ...item }));

    useEffect(() => {
        setFormData({ ...item });
    }, [item]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Modifier Non-Conformité</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            rows={4}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="respAction" className="block text-sm font-medium text-gray-300">Responsable</label>
                            <select 
                                id="respAction" 
                                name="respAction" 
                                value={formData.respAction} 
                                onChange={handleChange} 
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
                            >
                                <option value="">Sélectionner...</option>
                                {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="statut" className="block text-sm font-medium text-gray-300">Statut</label>
                            <select 
                                id="statut" 
                                name="statut" 
                                value={formData.statut} 
                                onChange={handleChange} 
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
                            >
                                <option value="Ouverte">Ouverte</option>
                                <option value="Clôturée">Clôturée</option>
                            </select>
                        </div>
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

export default NonConformiteModal;
