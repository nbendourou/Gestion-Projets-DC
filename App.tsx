import React, { useState, useMemo, useEffect } from 'react';

// Import types and enums
import type { 
    View, 
    Project,
    Action, 
    Contact, 
    Historique, 
    NonConformiteMineure, 
    QualiteHSE, 
    Echantillon, 
    Commissioning 
} from './types.ts';
import { TypeEvenement } from './types.ts';

// Import Supabase client
import { supabase } from './lib/supabaseClient.ts';
// Import data mappers
import {
    dbToProject, projectToDb,
    dbToAction, actionToDb,
    dbToContact, contactToDb,
    dbToHistorique, historiqueToDb,
    dbToNonConformite, nonConformiteToDb,
    dbToQualiteHSE, qualiteHSEToDb,
    dbToEchantillon, echantillonToDb,
    dbToCommissioning, commissioningToDb,
} from './lib/dataMappers.ts';


// Import all view and modal components
import KanbanBoard from './components/KanbanBoard.tsx';
import Dashboard from './components/Dashboard.tsx';
import ComplianceView from './components/ComplianceView.tsx';
import NonConformitesView from './components/NonConformitesView.tsx';
import MoMGenerator from './components/MoMGenerator.tsx';
import MeetingView from './components/MeetingView.tsx';
import SettingsView from './components/SettingsView.tsx';
import EmailReminder from './components/EmailReminder.tsx';

// Simple SVG Icons for the sidebar
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const KanbanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z" /></svg>;
const ComplianceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const NonConformityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const MoMIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const MeetingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const App: React.FC = () => {
    // Main state for navigation and data
    const [view, setView] = useState<View>('dashboard');
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Data states
    const [actions, setActions] = useState<Action[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [historique, setHistorique] = useState<Historique[]>([]);
    const [nonConformites, setNonConformites] = useState<NonConformiteMineure[]>([]);
    const [qualiteHSE, setQualiteHSE] = useState<QualiteHSE[]>([]);
    const [echantillons, setEchantillons] = useState<Echantillon[]>([]);
    const [commissioning, setCommissioning] = useState<Commissioning[]>([]);

    // State for the email reminder modal
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [targetedContact, setTargetedContact] = useState<(Contact & { action?: Action }) | null>(null);
    
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);

            const fetchAndMap = async <T,>(tableName: string, mapper: (dbData: any) => T): Promise<T[]> => {
                const { data, error } = await supabase.from(tableName).select('*');
                if (error) {
                    throw new Error(`Erreur lors de la lecture de la table '${tableName}': ${error.message}`);
                }
                return (data || []).map(mapper);
            };

            try {
                const projectsData = await fetchAndMap('projects', dbToProject);
                setProjects(projectsData);

                if (projectsData.length > 0) {
                    setSelectedProjectId(projectsData[0].id);
                } else {
                    setLoading(false);
                    return;
                }

                setActions(await fetchAndMap('actions', dbToAction));
                setContacts(await fetchAndMap('contacts', dbToContact));
                setHistorique(await fetchAndMap('historique', dbToHistorique));
                setNonConformites(await fetchAndMap('non_conformites', dbToNonConformite));
                setQualiteHSE(await fetchAndMap('qualite_hse', dbToQualiteHSE));
                setEchantillons(await fetchAndMap('echantillons', dbToEchantillon));
                setCommissioning(await fetchAndMap('commissioning', dbToCommissioning));

            } catch (err) {
                console.error("Error caught during data fetch:", err);
                const errorMessage = (err instanceof Error) ? err.message : "Une erreur inconnue est survenue.";
                setError(`Erreur de chargement des données:\n\n${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Memoized, filtered data based on the selected project
    const filteredData = useMemo(() => {
        if (!selectedProjectId) {
            return { actions: [], contacts: [], historique: [], nonConformites: [], qualiteHSE: [], echantillons: [], commissioning: [] };
        }
        const filterByProject = (item: { projectId?: string, projet_id?: string }) => (item.projectId || item.projet_id) === selectedProjectId;

        return {
            actions: actions.filter(filterByProject),
            contacts: contacts.filter(filterByProject),
            historique: historique.filter(filterByProject),
            nonConformites: nonConformites.filter(filterByProject),
            qualiteHSE: qualiteHSE.filter(filterByProject),
            echantillons: echantillons.filter(filterByProject),
            commissioning: commissioning.filter(filterByProject),
        };
    }, [selectedProjectId, actions, contacts, historique, nonConformites, qualiteHSE, echantillons, commissioning]);

    const selectedProjectName = useMemo(() => projects.find(p => p.id === selectedProjectId)?.nomProjet || 'Aucun Projet', [selectedProjectId, projects]);

    // Data manipulation handlers
    const addHistoryEntry = async (actionId: string, type: TypeEvenement, description: string) => {
        const newEntry: Historique = {
            id: `H${Date.now()}`, // Generate a client-side ID to prevent insertion errors
            projectId: selectedProjectId, 
            idActionRef: actionId,
            dateLog: new Date().toISOString(), 
            typeEvenement: type, 
            evenementDetail: description
        };
        const { data, error } = await supabase.from('historique').insert(historiqueToDb(newEntry)).select();
        if (error) {
            console.error("Error adding history:", error);
            alert(`Erreur lors de l'ajout à l'historique: ${error.message}`);
        } else {
            setHistorique(prev => [dbToHistorique(data[0]), ...prev]);
        }
    };

    const handleSaveAction = async (actionToSave: Action) => {
        const isUpdate = actions.some(a => a.id === actionToSave.id);
        if (isUpdate) {
            const oldAction = actions.find(a => a.id === actionToSave.id);
            const { id, ...dbData } = actionToDb(actionToSave);
            const { data, error } = await supabase.from('actions').update(dbData).eq('id', actionToSave.id).select();
            if (error) {
                console.error("Error updating action:", error);
                alert(`Erreur lors de la mise à jour de l'action: ${error.message}`);
            } else {
                setActions(prev => prev.map(a => a.id === actionToSave.id ? dbToAction(data[0]) : a));
                if(oldAction && oldAction.statutKanban !== actionToSave.statutKanban) {
                    await addHistoryEntry(actionToSave.id, TypeEvenement.CHANGEMENT_STATUT, `Statut changé de "${oldAction.statutKanban}" à "${actionToSave.statutKanban}"`);
                }
            }
        } else {
            const newActionWithProject = { ...actionToSave, projectId: selectedProjectId };
            const dbData = actionToDb(newActionWithProject);
            const { data, error } = await supabase.from('actions').insert(dbData).select();
            if (error) {
                console.error("Error creating action:", error);
                alert(`Erreur lors de la création de l'action: ${error.message}`);
            } else {
                const newAction = dbToAction(data[0]);
                setActions(prev => [...prev, newAction]);
                await addHistoryEntry(newAction.id, TypeEvenement.CREATION, `Action "${newAction.nomLivrable}" créée.`);
            }
        }
    };

    const handleDeleteAction = async (actionId: string) => {
        const { error } = await supabase.from('actions').delete().eq('id', actionId);
        if (error) console.error("Error deleting action:", error);
        else setActions(prev => prev.filter(a => a.id !== actionId));
    };
    
    const handleSaveProject = async (project: Project) => {
        const isUpdate = projects.some(p => p.id === project.id);
        if (isUpdate) {
            const { id, ...dbData } = projectToDb(project);
            const { data, error } = await supabase.from('projects').update(dbData).eq('id', project.id).select();
            if (error) console.error("Error updating project:", error);
            else setProjects(prev => prev.map(p => p.id === project.id ? dbToProject(data[0]) : p));
        } else {
            const dbData = projectToDb(project);
            const { data, error } = await supabase.from('projects').insert(dbData).select();
            if (error) console.error("Error creating project:", error);
            else {
                const newProject = dbToProject(data[0]);
                setProjects(prev => [...prev, newProject]);
                setSelectedProjectId(newProject.id);
            }
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        const { error } = await supabase.from('projects').delete().eq('id', projectId);
        if (error) console.error("Error deleting project:", error);
        else {
             setActions(prev => prev.filter(a => a.projectId !== projectId));
             setContacts(prev => prev.filter(c => c.projectId !== projectId));
             setHistorique(prev => prev.filter(h => h.projectId !== projectId));
             setNonConformites(prev => prev.filter(nc => nc.projectId !== projectId));
             setQualiteHSE(prev => prev.filter(q => q.projectId !== projectId));
             setEchantillons(prev => prev.filter(e => e.projectId !== projectId));
             setCommissioning(prev => prev.filter(c => c.projectId !== projectId));
             
             const newProjects = projects.filter(p => p.id !== projectId);
             setProjects(newProjects);
             if (selectedProjectId === projectId) {
                 setSelectedProjectId(newProjects[0]?.id || '');
             }
        }
    };

    const handleSaveContact = async (contact: Contact) => {
        const isUpdate = contacts.some(c => c.id === contact.id);
        if (isUpdate) {
             const { id, ...dbData } = contactToDb(contact);
             const { data, error } = await supabase.from('contacts').update(dbData).eq('id', contact.id).select();
             if (error) {
                 console.error("Error updating contact:", error);
                 alert(`Erreur lors de la mise à jour du contact: ${error.message}`);
             } else {
                 setContacts(prev => prev.map(c => c.id === contact.id ? dbToContact(data[0]) : c));
             }
        } else {
             const { data, error } = await supabase.from('contacts').insert(contactToDb(contact)).select();
             if (error) {
                 console.error("Error creating contact:", error);
                 alert(`Erreur lors de la création du contact: ${error.message}`);
             } else {
                 setContacts(prev => [...prev, dbToContact(data[0])]);
             }
        }
    };

    const handleDeleteContact = async (contactId: string) => {
        const { error } = await supabase.from('contacts').delete().eq('id', contactId);
        if (error) console.error("Error deleting contact:", error);
        else setContacts(prev => prev.filter(c => c.id !== contactId));
    };

    const handleSaveNonConformite = async (item: NonConformiteMineure) => {
        const originalItem = nonConformites.find(nc => nc.id === item.id);
        let itemToSave = { ...item };

        // If status changed to 'Clôturée' and it was not before, set the closing date
        if (item.statut === 'Clôturée' && originalItem?.statut !== 'Clôturée') {
            itemToSave.dateCloture = new Date().toISOString();
        }

        const { id, ...dbData } = nonConformiteToDb(itemToSave);
        const { data, error } = await supabase.from('non_conformites').update(dbData).eq('id', item.id).select();

        if (error) {
            console.error("Error updating NonConformite:", error);
            alert(`Erreur lors de la mise à jour de la non-conformité: ${error.message}`);
        } else {
            setNonConformites(prev => prev.map(i => i.id === item.id ? dbToNonConformite(data[0]) : i));
        }
    };


    const handleSaveQualiteHSE = async (item: QualiteHSE) => {
        const { id, ...dbData } = qualiteHSEToDb(item);
        const { data, error } = await supabase.from('qualite_hse').update(dbData).eq('id', item.id).select();
        if (error) console.error("Error updating QualiteHSE:", error);
        else setQualiteHSE(prev => prev.map(i => i.id === item.id ? dbToQualiteHSE(data[0]) : i));
    };
    const handleSaveEchantillon = async (item: Echantillon) => {
        const { id, ...dbData } = echantillonToDb(item);
        const { data, error } = await supabase.from('echantillons').update(dbData).eq('id', item.id).select();
        if (error) console.error("Error updating Echantillon:", error);
        else setEchantillons(prev => prev.map(i => i.id === item.id ? dbToEchantillon(data[0]) : i));
    };
    const handleSaveCommissioning = async (item: Commissioning) => {
        const { id, ...dbData } = commissioningToDb(item);
        const { data, error } = await supabase.from('commissioning').update(dbData).eq('id', item.id).select();
        if (error) console.error("Error updating Commissioning:", error);
        else setCommissioning(prev => prev.map(i => i.id === item.id ? dbToCommissioning(data[0]) : i));
    };

    // Email modal handlers
    const handleRemind = (contact: Contact, action: Action) => {
        setTargetedContact({ ...contact, action });
        setIsEmailModalOpen(true);
    };

    const handleSendEmail = (subject: string, body: string, recipients: string[]) => {
        console.log("SIMULATING EMAIL SEND:", { subject, body, recipients });
        alert(`Email de rappel envoyé (simulation) à : ${recipients.join(', ')}`);
        setIsEmailModalOpen(false);
        setTargetedContact(null);
    };

    const renderView = () => {
        if (!selectedProjectId && view !== 'settings' && projects.length > 0) {
            return (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Aucun projet sélectionné</h2>
                    <p className="mt-4 text-gray-400">Veuillez sélectionner un projet dans le menu de gauche.</p>
                </div>
            );
        }
        
         if (projects.length === 0 && !loading) {
            return (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Bienvenue !</h2>
                    <p className="mt-4 text-gray-400">Commencez par créer votre premier projet dans les paramètres.</p>
                </div>
            );
        }
        
        switch (view) {
            case 'dashboard': return <Dashboard actions={filteredData.actions} contacts={filteredData.contacts} historique={filteredData.historique} onRemind={handleRemind} />;
            case 'kanban': return <KanbanBoard actions={filteredData.actions} contacts={contacts} historique={filteredData.historique} onSaveAction={handleSaveAction} onDeleteAction={handleDeleteAction} projectId={selectedProjectId} />;
            case 'compliance': return <ComplianceView qualiteHSE={filteredData.qualiteHSE} echantillons={filteredData.echantillons} commissioning={filteredData.commissioning} onSaveQualiteHSE={handleSaveQualiteHSE} onSaveEchantillon={handleSaveEchantillon} onSaveCommissioning={handleSaveCommissioning} />;
            case 'non-conformites': return <NonConformitesView nonConformites={filteredData.nonConformites} actions={filteredData.actions} contacts={contacts} onSaveNonConformite={handleSaveNonConformite} />;
            case 'mom-generator': return <MoMGenerator actions={filteredData.actions} contacts={contacts} historique={filteredData.historique} nonConformites={filteredData.nonConformites} />;
            case 'meeting': return <MeetingView actions={filteredData.actions} contacts={contacts} onSaveAction={handleSaveAction} addHistoryEntry={addHistoryEntry} projectId={selectedProjectId} />;
            case 'settings': return <SettingsView projects={projects} contacts={contacts} selectedProjectId={selectedProjectId} onSaveProject={handleSaveProject} onDeleteProject={handleDeleteProject} onSaveContact={handleSaveContact} onDeleteContact={handleDeleteContact} />;
            default: return <div className="text-center text-white">Vue non trouvée.</div>;
        }
    };
    
    const NavItem: React.FC<{ label: string; icon: React.ReactNode; currentView: View; targetView: View; setView: (v: View) => void; }> = ({ label, icon, currentView, targetView, setView }) => (
        <button onClick={() => setView(targetView)} className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left transition-colors ${currentView === targetView ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
            {icon}
            <span>{label}</span>
        </button>
    );
    
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-white text-xl">Chargement des données...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-400 text-lg p-8 text-center whitespace-pre-wrap">{error}</div>;
    }

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen flex font-sans">
            <nav className="w-64 bg-gray-800 p-4 flex flex-col flex-shrink-0">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white text-center">PMO-Pilot</h1>
                </div>
                
                <div className="mb-6">
                    <label htmlFor="project-select" className="block text-sm font-medium text-gray-400 mb-2">Projet Actif</label>
                    <select id="project-select" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        {projects.length === 0 && <option>Créez un projet</option>}
                        {projects.map(p => <option key={p.id} value={p.id}>{p.nomProjet}</option>)}
                    </select>
                </div>
                
                <div className="space-y-2 flex-1">
                    <NavItem label="Tableau de bord" icon={<HomeIcon />} currentView={view} targetView="dashboard" setView={setView} />
                    <NavItem label="Kanban" icon={<KanbanIcon />} currentView={view} targetView="kanban" setView={setView} />
                    <NavItem label="Revue de Réunion" icon={<MeetingIcon />} currentView={view} targetView="meeting" setView={setView} />
                    <NavItem label="Qualité & Compliance" icon={<ComplianceIcon />} currentView={view} targetView="compliance" setView={setView} />
                    <NavItem label="Non-Conformités" icon={<NonConformityIcon />} currentView={view} targetView="non-conformites" setView={setView} />
                    <NavItem label="Générateur MoM" icon={<MoMIcon />} currentView={view} targetView="mom-generator" setView={setView} />
                </div>

                <div>
                    <NavItem label="Paramètres" icon={<SettingsIcon />} currentView={view} targetView="settings" setView={setView} />
                </div>
            </nav>

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-400">{selectedProjectName}</h2>
                </header>
                {renderView()}
            </main>
            
            <EmailReminder 
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSend={handleSendEmail}
                contacts={contacts} // Pass all contacts for the recipient list
                targetedContact={targetedContact}
            />
        </div>
    );
};

export default App;