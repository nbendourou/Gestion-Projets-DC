// components/ComplianceView.tsx

import React, { useState } from 'react';
import type { QualiteHSE, Echantillon, Commissioning } from '../types.ts';
import QualiteHSEModal from './QualiteHSEModal.tsx';
import EchantillonModal from './EchantillonModal.tsx';
import CommissioningModal from './CommissioningModal.tsx';

interface ComplianceViewProps {
    qualiteHSE: QualiteHSE[];
    echantillons: Echantillon[];
    commissioning: Commissioning[];
    onSaveQualiteHSE: (item: QualiteHSE) => void;
    onSaveEchantillon: (item: Echantillon) => void;
    onSaveCommissioning: (item: Commissioning) => void;
}

const ComplianceView: React.FC<ComplianceViewProps> = ({ 
    qualiteHSE, 
    echantillons, 
    commissioning,
    onSaveQualiteHSE,
    onSaveEchantillon,
    onSaveCommissioning
}) => {
    const [selectedHSE, setSelectedHSE] = useState<QualiteHSE | null>(null);
    const [selectedEchantillon, setSelectedEchantillon] = useState<Echantillon | null>(null);
    const [selectedCommissioning, setSelectedCommissioning] = useState<Commissioning | null>(null);

    const TableRow: React.FC<{children: React.ReactNode, onClick: () => void}> = ({children, onClick}) => (
        <tr onClick={onClick} className="bg-gray-800 hover:bg-gray-700/60 border-b border-gray-700 cursor-pointer transition-colors">
            {children}
            <td className="px-6 py-4 text-right">
                <button className="font-medium text-blue-400 hover:text-blue-300">Modifier</button>
            </td>
        </tr>
    );

    return (
        <div className="h-full flex flex-col space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-6">Suivi Qualité / HSE</h2>
                <div className="bg-gray-800/50 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Document</th>
                                <th scope="col" className="px-6 py-3">Lot</th>
                                <th scope="col" className="px-6 py-3">Statut</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {qualiteHSE.map(item => (
                                <TableRow key={item.id} onClick={() => setSelectedHSE(item)}>
                                    <td className="px-6 py-4 font-medium text-white">{item.typeDocument}</td>
                                    <td className="px-6 py-4">{item.lotAssocie}</td>
                                    <td className="px-6 py-4">{item.statutFinal}</td>
                                </TableRow>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             <div>
                <h2 className="text-3xl font-bold text-white mb-6">Suivi des Échantillons</h2>
                <div className="bg-gray-800/50 rounded-xl overflow-hidden">
                     <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Produit</th>
                                <th scope="col" className="px-6 py-3">Référence</th>
                                <th scope="col" className="px-6 py-3">Statut</th>
                                 <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {echantillons.map(item => (
                                <TableRow key={item.id} onClick={() => setSelectedEchantillon(item)}>
                                    <td className="px-6 py-4 font-medium text-white">{item.nomProduit}</td>
                                    <td className="px-6 py-4">{item.marqueModeleRef}</td>
                                    <td className="px-6 py-4">{item.statutValidation}</td>
                                </TableRow>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
             <div>
                <h2 className="text-3xl font-bold text-white mb-6">Suivi Commissioning</h2>
                <div className="bg-gray-800/50 rounded-xl overflow-hidden">
                     <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Jalon</th>
                                <th scope="col" className="px-6 py-3">Date Prévue</th>
                                <th scope="col" className="px-6 py-3">Scripts Validés</th>
                                <th scope="col" className="px-6 py-3">Matériel Étalonné</th>
                                 <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {commissioning.map(item => (
                                <TableRow key={item.id} onClick={() => setSelectedCommissioning(item)}>
                                    <td className="px-6 py-4 font-medium text-white">{item.jalonCx}</td>
                                    <td className="px-6 py-4">{new Date(item.datePrevue).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{item.scriptsValide ? 'Oui' : 'Non'}</td>
                                    <td className="px-6 py-4">{item.materielEtalonnage}</td>
                                </TableRow>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {selectedHSE && <QualiteHSEModal key={selectedHSE.id} isOpen={!!selectedHSE} onClose={() => setSelectedHSE(null)} item={selectedHSE} onSave={onSaveQualiteHSE} />}
            {selectedEchantillon && <EchantillonModal key={selectedEchantillon.id} isOpen={!!selectedEchantillon} onClose={() => setSelectedEchantillon(null)} item={selectedEchantillon} onSave={onSaveEchantillon} />}
            {selectedCommissioning && <CommissioningModal key={selectedCommissioning.id} isOpen={!!selectedCommissioning} onClose={() => setSelectedCommissioning(null)} item={selectedCommissioning} onSave={onSaveCommissioning} />}
        </div>
    );
};

export default ComplianceView;