

import React, { useState, useEffect } from 'react';
// Fix: Create the ProjectModal component.
import type { Project } from '../types.ts';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: Project) => void;
    project: Project | null;
}

const getNewProject = (): Omit<Project, 'id'> => ({
    nomProjet: ''
});

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, project }) => {
    const [formData, setFormData] = useState(() => project ? { ...project } : getNewProject());

    useEffect(() => {
        if (isOpen) {
            setFormData(project ? { ...project } : getNewProject());
        }
    }, [project, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, nomProjet: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nomProjet.trim()) {
            alert('Le nom du projet est requis.');
            return;
        }
        const finalProject = project 
            ? { ...project, nomProjet: formData.nomProjet }
            : { ...formData, id: `P${Date.now()}` };
        
        onSave(finalProject as Project);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">{project ? 'Modifier le' : 'Ajouter un'} projet</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6">
                    <div>
                        <label htmlFor="nomProjet" className="block text-sm font-medium text-gray-300">Nom du Projet</label>
                        <input 
                            type="text" 
                            id="nomProjet"
                            name="nomProjet"
                            value={formData.nomProjet} 
                            onChange={handleChange}
                            required
                            autoFocus
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
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

export default ProjectModal;