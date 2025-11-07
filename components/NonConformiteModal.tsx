import React, { useState, useEffect } from 'react';
import type { NonConformiteMineure, Contact } from '../types.ts';
import { supabase } from '../lib/supabaseClient.ts';

interface NonConformiteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: NonConformiteMineure) => void;
    item: NonConformiteMineure;
    contacts: Contact[];
}

const NonConformiteModal: React.FC<NonConformiteModalProps> = ({ isOpen, onClose, onSave, item, contacts }) => {
    const [formData, setFormData] = useState<NonConformiteMineure>(() => ({ ...item }));
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setFormData({ ...item });
        setSelectedFile(null);
        setImagePreviewUrl(null);
    }, [item]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resizeImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1280;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        return reject(new Error('Could not get canvas context'));
                    }
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(blob => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Canvas to Blob conversion failed'));
                        }
                    }, 'image/jpeg', 0.8);
                };
            };
            reader.onerror = error => reject(error);
        });
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemovePhoto = () => {
        setFormData(prev => ({ ...prev, photoUrl: null }));
        setSelectedFile(null);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        let itemToSave = { ...formData };

        if (selectedFile) {
            try {
                const resizedBlob = await resizeImage(selectedFile);
                const filePath = `public/nc-${item.id}-${Date.now()}.jpg`;
                
                const { error: uploadError } = await supabase.storage
                    .from('photos_non_conformites')
                    .upload(filePath, resizedBlob);
                
                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('photos_non_conformites')
                    .getPublicUrl(filePath);

                itemToSave.photoUrl = data.publicUrl;

            } catch (error) {
                console.error("Error uploading photo:", error);
                alert("Erreur lors de l'envoi de la photo.");
                setIsUploading(false);
                return;
            }
        }
        
        onSave(itemToSave);
        setIsUploading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Modifier Non-Conformité</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            rows={3}
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
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Photo</label>
                        <div className="mt-1 flex items-center space-x-4">
                            <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                                {imagePreviewUrl ? (
                                    <img src={imagePreviewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                                ) : formData.photoUrl ? (
                                    <img src={formData.photoUrl} alt="Photo existante" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                )}
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="photo-upload" className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg text-sm text-center">
                                    {isUploading ? 'Chargement...' : 'Changer'}
                                </label>
                                <input id="photo-upload" name="photo-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isUploading} />
                                {(formData.photoUrl || imagePreviewUrl) && (
                                    <button type="button" onClick={handleRemovePhoto} className="text-red-400 hover:underline text-sm" disabled={isUploading}>Supprimer la photo</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-700/50 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg" disabled={isUploading}>Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:bg-gray-500" disabled={isUploading}>
                        {isUploading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NonConformiteModal;