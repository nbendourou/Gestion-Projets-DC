import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="mt-2 text-gray-300">{message}</p>
                </div>
                <div className="p-4 bg-gray-700/50 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
