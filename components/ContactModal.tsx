// Fix: Create the ContactModal component to be used in SettingsView for managing contacts.
import React, { useState, useEffect } from 'react';
import type { Contact, Project } from '../types.ts';
import { CompanyRole } from '../types.ts';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (contact: Contact) => void;
    contact: Contact | null;
    projects: Project[];
    defaultProjectId?: string;
}

const getNewContact = (defaultProjectId?: string): Omit<Contact, 'id'> => ({
    projectId: defaultProjectId || '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    function: '',
    companyRole: CompanyRole.AUTRE,
});

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, contact, projects, defaultProjectId }) => {
    const [formData, setFormData] = useState(() => contact ? { ...contact } : getNewContact(defaultProjectId));

    useEffect(() => {
        if (isOpen) {
            setFormData(contact ? { ...contact } : getNewContact(defaultProjectId));
        }
    }, [contact, isOpen, defaultProjectId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.projectId) {
            alert('Veuillez sélectionner un projet.');
            return;
        }
        const finalContact = contact 
            ? formData 
            : { ...formData, id: `c${Date.now()}` };

        onSave(finalContact as Contact);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">{contact ? 'Modifier le' : 'Ajouter un'} contact</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Form fields for contact */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">Prénom</label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                         <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Nom</label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Téléphone</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                     <div>
                        <label htmlFor="function" className="block text-sm font-medium text-gray-300">Fonction</label>
                        <input type="text" id="function" name="function" value={formData.function} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="companyRole" className="block text-sm font-medium text-gray-300">Rôle</label>
                            <select id="companyRole" name="companyRole" value={formData.companyRole} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                {Object.values(CompanyRole).map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="projectId" className="block text-sm font-medium text-gray-300">Projet</label>
                            <select id="projectId" name="projectId" value={formData.projectId} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Sélectionner...</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.nomProjet}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-700 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Enregistrer</button>
                </div>
            </form>
        </div>
    );
};

export default ContactModal;