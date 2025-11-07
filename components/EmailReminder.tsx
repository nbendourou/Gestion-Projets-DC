import React, { useState, useEffect } from 'react';
import type { Contact, CompanyRole, Action } from '../types.ts';

interface EmailReminderProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (subject: string, body: string, recipients: string[]) => void;
    contacts: Contact[];
    targetedContact?: (Contact & { action?: Action }) | null;
}

const getEmailTemplate = (contact: Contact, action?: Action): { subject: string, body: string } => {
    const defaultSubject = `[RAPPEL] Suivi de projet Data Center`;
    const defaultBody = `Bonjour ${contact.firstName},\n\nMerci de faire le point sur les actions en attente.\n\nCordialement,`;

    if (!action) {
        return { subject: defaultSubject, body: defaultBody };
    }

    const subject = `[RAPPEL] Action en retard: ${action.nomLivrable}`;
    let body = `Bonjour ${contact.firstName},\n\nJe me permets de vous relancer concernant le livrable "${action.nomLivrable}".\nLa date limite était le ${new Date(action.derniereLimite).toLocaleDateString()} et nous sommes en attente de sa soumission ou mise à jour.\n\n`;

    switch (contact.companyRole) {
        case 'Architecte':
            body += `Votre validation est cruciale pour l'avancement du projet. Pouvez-vous nous donner une visibilité ?\n\n`;
            break;
        case 'Entreprise Construction':
        case 'Entreprise Technique':
            body += `Le non-respect de cette échéance risque d'impacter le planning général. Merci de nous faire un retour sur l'état d'avancement au plus vite.\n\n`;
            break;
        default:
            body += `Merci de faire le nécessaire pour clôturer ce point.\n\n`;
            break;
    }

    body += `Cordialement,\nLe PMO`;

    return { subject, body };
};


const EmailReminder: React.FC<EmailReminderProps> = ({ isOpen, onClose, onSend, contacts, targetedContact }) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [recipients, setRecipients] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (targetedContact) {
                const template = getEmailTemplate(targetedContact, targetedContact.action);
                setSubject(template.subject);
                setBody(template.body);
                setRecipients([targetedContact.email]);
            } else {
                setSubject('');
                setBody('');
                setRecipients([]);
            }
        }
    }, [isOpen, targetedContact]);

    const handleSend = () => {
        if (recipients.length === 0) {
            alert("Veuillez sélectionner au moins un destinataire.");
            return;
        }
        onSend(subject, body, recipients);
    };
    
    const toggleRecipient = (email: string) => {
        setRecipients(prev => 
            prev.includes(email) ? prev.filter(r => r !== email) : [...prev, email]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Envoyer un Rappel par E-mail</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="recipients" className="block text-sm font-medium text-gray-300 mb-2">Destinataires</label>
                        <div className="bg-gray-900 p-2 rounded-md max-h-32 overflow-y-auto">
                            {contacts.map(contact => (
                                <div key={contact.id} className="flex items-center p-1">
                                    <input 
                                        type="checkbox" 
                                        id={`contact-${contact.id}`}
                                        checked={recipients.includes(contact.email)}
                                        onChange={() => toggleRecipient(contact.email)}
                                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`contact-${contact.id}`} className="ml-3 text-sm text-gray-200">{contact.firstName} {contact.lastName} ({contact.email})</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Sujet</label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-gray-300">Corps du message</label>
                        <textarea
                            id="body"
                            rows={8}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
                <div className="p-4 border-t border-gray-700 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg">Annuler</button>
                    <button onClick={handleSend} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Envoyer</button>
                </div>
            </div>
        </div>
    );
};

export default EmailReminder;