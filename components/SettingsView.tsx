
// Fix: Create the SettingsView component to manage projects and contacts, resolving import errors.
import React, { useState } from 'react';
import type { Project, Contact } from '../types.ts';
import ProjectModal from './ProjectModal.tsx';
import ContactModal from './ContactModal.tsx';
import ConfirmationModal from './ConfirmationModal.tsx';

interface SettingsViewProps {
    projects: Project[];
    contacts: Contact[];
    selectedProjectId: string;
    onSaveProject: (project: Project) => void;
    onDeleteProject: (projectId: string) => void;
    onSaveContact: (contact: Contact) => void;
    onDeleteContact: (contactId: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ projects, contacts, onSaveProject, onDeleteProject, onSaveContact, onDeleteContact, selectedProjectId }) => {
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'project' | 'contact', id: string } | null>(null);

    const handleAddProject = () => {
        setSelectedProject(null);
        setIsProjectModalOpen(true);
    };

    const handleEditProject = (project: Project) => {
        setSelectedProject(project);
        setIsProjectModalOpen(true);
    };

    const handleDeleteRequest = (type: 'project' | 'contact', id: string) => {
        setItemToDelete({ type, id });
        setIsConfirmModalOpen(true);
    };

    const handleAddContact = () => {
        setSelectedContact(null);
        setIsContactModalOpen(true);
    };

    const handleEditContact = (contact: Contact) => {
        setSelectedContact(contact);
        setIsContactModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            if (itemToDelete.type === 'project') {
                onDeleteProject(itemToDelete.id);
            } else {
                onDeleteContact(itemToDelete.id);
            }
        }
        setIsConfirmModalOpen(false);
        setItemToDelete(null);
    };
    
    const getProjectName = (projectId: string) => projects.find(p => p.id === projectId)?.nomProjet || 'N/A';

    return (
        <div className="h-full flex flex-col space-y-8">
            <h2 className="text-3xl font-bold text-white">Paramètres</h2>
            {/* Project Management */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-gray-200">Gestion des Projets</h3>
                    <button onClick={handleAddProject} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">+ Nouveau Projet</button>
                </div>
                <div className="bg-gray-800/50 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nom du Projet</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(p => (
                                <tr key={p.id} className="bg-gray-800 hover:bg-gray-700/60 border-b border-gray-700">
                                    <td className="px-6 py-4 font-medium text-white">{p.nomProjet}</td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button onClick={() => handleEditProject(p)} className="font-medium text-blue-400 hover:text-blue-300">Modifier</button>
                                        <button onClick={() => handleDeleteRequest('project', p.id)} className="font-medium text-red-400 hover:text-red-300">Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Contact Management */}
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-gray-200">Gestion des Contacts</h3>
                    <button onClick={handleAddContact} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">+ Nouveau Contact</button>
                </div>
                <div className="bg-gray-800/50 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nom</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Rôle</th>
                                <th scope="col" className="px-6 py-3">Projet</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(c => (
                                <tr key={c.id} className="bg-gray-800 hover:bg-gray-700/60 border-b border-gray-700">
                                    <td className="px-6 py-4 font-medium text-white">{c.firstName} {c.lastName}</td>
                                    <td className="px-6 py-4">{c.email}</td>
                                    <td className="px-6 py-4">{c.companyRole}</td>
                                    <td className="px-6 py-4">{getProjectName(c.projectId)}</td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button onClick={() => handleEditContact(c)} className="font-medium text-blue-400 hover:text-blue-300">Modifier</button>
                                        <button onClick={() => handleDeleteRequest('contact', c.id)} className="font-medium text-red-400 hover:text-red-300">Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isProjectModalOpen && (
                <ProjectModal 
                    isOpen={isProjectModalOpen} 
                    onClose={() => setIsProjectModalOpen(false)} 
                    onSave={onSaveProject} 
                    project={selectedProject} 
                />
            )}
            
            {isContactModalOpen && (
                <ContactModal 
                    isOpen={isContactModalOpen} 
                    onClose={() => setIsContactModalOpen(false)} 
                    onSave={onSaveContact} 
                    contact={selectedContact}
                    projects={projects}
                    defaultProjectId={selectedProjectId}
                />
            )}
            
            {isConfirmModalOpen && (
                 <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title={`Confirmer la suppression`}
                    message={`Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`}
                />
            )}
        </div>
    );
};

export default SettingsView;
