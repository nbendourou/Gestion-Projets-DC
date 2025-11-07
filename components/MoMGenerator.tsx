import React, { useState } from 'react';
import type { Action, Contact, Historique, NonConformiteMineure } from '../types.ts';
import { StatutKanban } from '../types.ts';

interface MoMGeneratorProps {
    actions: Action[];
    contacts: Contact[];
    historique: Historique[];
    nonConformites: NonConformiteMineure[];
}

const MoMGenerator: React.FC<MoMGeneratorProps> = ({ actions, contacts, historique, nonConformites }) => {
    const [generatedMoM, setGeneratedMoM] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getContactName = (id: string) => {
        const contact = contacts.find(c => c.id === id);
        return contact ? `${contact.firstName} ${contact.lastName}` : `ID:${id}`;
    };

    const generateMoMTemplate = () => {
        const actionsEnRetard = actions.filter(a => new Date(a.derniereLimite) < new Date() && a.statutKanban !== StatutKanban.CLOTURE);
        const actionsClotureesRecemment = actions.filter(a => {
            const history = historique.filter(h => h.idActionRef === a.id && h.typeEvenement === 'Changement de statut' && h.evenementDetail.includes(StatutKanban.CLOTURE));
            if (history.length > 0) {
                const closeDate = new Date(history.sort((a, b) => new Date(b.dateLog).getTime() - new Date(a.dateLog).getTime())[0].dateLog);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return closeDate > sevenDaysAgo;
            }
            return false;
        });
        const pointsBloquants = nonConformites.filter(nc => nc.statut === 'Ouverte');

        const actionsEnRetardHtml = actionsEnRetard.length > 0
            ? actionsEnRetard.map(a => `<tr><td style="padding: 8px; border: 1px solid #4a5568;">${a.nomLivrable}</td><td style="padding: 8px; border: 1px solid #4a5568;">${getContactName(a.respExecution)}</td><td style="padding: 8px; border: 1px solid #4a5568;">${new Date(a.derniereLimite).toLocaleDateString()}</td><td style="padding: 8px; border: 1px solid #4a5568;">${a.statutKanban}</td></tr>`).join('')
            : '<tr><td colspan="4" style="padding: 8px; border: 1px solid #4a5568; color: #a0aec0;">Aucune action en retard critique.</td></tr>';

        const pointsBloquantsHtml = pointsBloquants.length > 0
            ? pointsBloquants.map(nc => `<tr><td style="padding: 8px; border: 1px solid #4a5568;">${actions.find(a => a.id === nc.idActionRef)?.nomLivrable || 'N/A'}</td><td style="padding: 8px; border: 1px solid #4a5568;">${nc.description}</td><td style="padding: 8px; border: 1px solid #4a5568;">${getContactName(nc.respAction)}</td></tr>`).join('')
            : '<tr><td colspan="3" style="padding: 8px; border: 1px solid #4a5568; color: #a0aec0;">Aucun point de blocage majeur identifié.</td></tr>';

        const actionsClotureesHtml = actionsClotureesRecemment.length > 0
            ? `<ul>${actionsClotureesRecemment.map(a => `<li>Livrable <strong>${a.nomLivrable}</strong> (Responsable: ${getContactName(a.respExecution)}) a été clôturé.</li>`).join('')}</ul>`
            : "<p style='color: #a0aec0;'>Aucune action clôturée récemment.</p>";

        return `
            <div style="font-family: Arial, sans-serif; color: #e2e8f0; background-color: #2d3748; padding: 20px; border-radius: 8px;">
                <h1 style="color: #ffffff; border-bottom: 2px solid #4a5568; padding-bottom: 10px;">Compte Rendu de Réunion PMO</h1>
                <p style="font-size: 1.1em;"><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                <h2 style="color: #f6ad55; background-color: rgba(246, 173, 85, 0.1); padding: 8px 12px; border-radius: 6px; border-left: 4px solid #f6ad55; margin-top: 25px;">1. Actions en Retard</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <thead style="background-color: #4a5568;">
                        <tr>
                            <th style="padding: 10px; text-align: left; border: 1px solid #4a5568;">Livrable</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #4a5568;">Responsable</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #4a5568;">Date Limite</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #4a5568;">Statut</th>
                        </tr>
                    </thead>
                    <tbody>${actionsEnRetardHtml}</tbody>
                </table>

                <h2 style="color: #f56565; background-color: rgba(245, 101, 101, 0.1); padding: 8px 12px; border-radius: 6px; border-left: 4px solid #f56565; margin-top: 25px;">2. Points de Blocage / Non-Conformités</h2>
                 <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <thead style="background-color: #4a5568;">
                        <tr>
                            <th style="padding: 10px; text-align: left; border: 1px solid #4a5568;">Action Associée</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #4a5568;">Description</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #4a5568;">Responsable</th>
                        </tr>
                    </thead>
                    <tbody>${pointsBloquantsHtml}</tbody>
                </table>
                
                <h2 style="color: #ffffff; margin-top: 25px;">3. Actions Clôturées Récemment</h2>
                ${actionsClotureesHtml}
                
                <h2 style="color: #ffffff; margin-top: 25px;">4. Prochaines Étapes et Décisions</h2>
                <p style="color: #a0aec0;">[À COMPLÉTER PAR LE PMO : Lister ici les décisions clés et les prochaines étapes. Rappeler aux responsables de mettre à jour leurs statuts.]</p>
                
                <p style="margin-top: 25px; border-top: 1px solid #4a5568; padding-top: 15px; font-size: 0.9em; color: #a0aec0;">
                    La prochaine réunion de suivi est prévue pour la semaine prochaine.
                </p>
            </div>
        `;
    };

    const handleGenerateMoM = () => {
        setIsLoading(true);
        setError('');
        setGeneratedMoM('');

        // Brief timeout to show loading feedback
        setTimeout(() => {
            try {
                const momContent = generateMoMTemplate();
                setGeneratedMoM(momContent);
            } catch (e: any) {
                console.error("Erreur lors de la génération du template MoM:", e);
                setError(`Une erreur est survenue: ${e.message}`);
            } finally {
                setIsLoading(false);
            }
        }, 200);
    };


    const handleCopyToClipboard = () => {
        if (!generatedMoM) return;
        
        try {
            const blob = new Blob([generatedMoM], { type: 'text/html' });
            const clipboardItem = new ClipboardItem({ 'text/html': blob });
            navigator.clipboard.write([clipboardItem]).then(() => {
                alert('Compte rendu copié dans le presse-papiers (avec formatage) !');
            });
        } catch (error) {
            console.error('Erreur lors de la copie HTML, copie en texte brut:', error);
            // Fallback to plain text copy
            const plainText = new DOMParser().parseFromString(generatedMoM, 'text/html').body.textContent || '';
             navigator.clipboard.writeText(plainText).then(() => {
                alert('Formatage non supporté, compte rendu copié en texte brut.');
            });
        }
    };

    return (
        <div className="h-full flex flex-col">
            <header className="mb-6 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Générateur de Template de Compte Rendu</h2>
                <button
                    onClick={handleGenerateMoM}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : '📝'}
                    <span className="ml-2">{isLoading ? 'Génération...' : 'Générer le Template'}</span>
                </button>
            </header>
            <div className="flex-1 bg-gray-800/50 rounded-xl p-6 flex flex-col">
                {error && <div className="bg-red-500/30 text-red-200 p-3 rounded-md mb-4">{error}</div>}
                <div className="flex-1 bg-gray-900/70 p-4 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none overflow-y-auto">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-full text-gray-400">Génération en cours...</div>
                    ) : generatedMoM ? (
                        <div dangerouslySetInnerHTML={{ __html: generatedMoM }} />
                    ) : (
                         <div className="flex justify-center items-center h-full text-gray-500">
                           L'aperçu du template de compte rendu apparaîtra ici.
                        </div>
                    )}
                </div>
                {generatedMoM && (
                    <div className="mt-4 text-right">
                        <button
                            onClick={handleCopyToClipboard}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg"
                        >
                            Copier pour E-mail
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoMGenerator;
