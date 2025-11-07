import React, { useState } from 'react';

interface QuickCommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (comment: string) => void;
    actionName: string;
}

const QuickCommentModal: React.FC<QuickCommentModalProps> = ({ isOpen, onClose, onSave, actionName }) => {
    const [comment, setComment] = useState('');

    const handleSave = () => {
        if (comment.trim()) {
            onSave(comment);
            setComment('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white truncate max-w-md">Ajouter un commentaire pour: {actionName}</h3>
                     <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder="Noter une décision, un point de blocage..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                    />
                </div>
                <div className="p-4 bg-gray-700/50 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg">
                        Annuler
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickCommentModal;
