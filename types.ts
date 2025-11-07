// Fix: Create the types.ts file to define all data structures.
export enum StatutKanban {
    A_SOUMETTRE = "À Soumettre",
    EN_REVUE_MOE = "En Revue MOE",
    VALIDÉ_AVEC_OBSERVATION_VAO = "Validé avec Obs. (VAO)",
    VALIDE_VSO = "Validé sans Obs. (VSO)",
    CLOTURE = "Clôturé",
}

export enum CriticiteAlerte {
    NORMAL = "Normal",
    VIGILANCE = "Vigilance",
    RETARD_CRITIQUE = "Retard Critique",
    NON_CONFORMITE_MAJEURE = "Non-conformité Majeure",
}

export enum CompanyRole {
    ARCHITECTE = "Architecte",
    ENTREPRISE_CONSTRUCTION = "Entreprise Construction",
    ENTREPRISE_TECHNIQUE = "Entreprise Technique",
    PMO = "PMO",
    AUTRE = "Autre",
}

export enum TypeEvenement {
    CREATION = "Création",
    CHANGEMENT_STATUT = "Changement de statut",
    MODIFICATION_DATE = "Modification de date",
    CHANGEMENT_RESPONSABLE = "Changement de responsable",
    AJOUT_COMMENTAIRE = "Ajout de commentaire",
}

export interface Project {
    id: string;
    nomProjet: string; // From nom_projet
}

export interface Action {
    id: string; // From id, was idAction
    projectId: string; // From projet_id
    nomLivrable: string; // From nom_livrable
    lotTechnique: 'CFO/CFA' | 'FLUIDE/CVC' | 'GO/ARCHI' | 'SSI' | 'Structure'; // From lot_technique
    indiceVersion: string; // From indice_version
    respExecution: string; // From resp_execution
    respValidationPpl: string; // From resp_validation_ppl
    dateLimiteInit: string; // From date_limite_init
    derniereLimite: string; // From derniere_limite
    statutKanban: StatutKanban; // From statut_kanban
    criticiteAlerte: CriticiteAlerte; // From criticite_alerte
    causeGlissement: string; // From cause_glissement
    commentaireStatut: string; // From commentaire_statut
    lienDriveDoc?: string; // From lien_drive_doc
    lienFicheVisa?: string; // From lien_fiche_visa
    nombreReports?: number; // From nombre_reports
}

export interface Contact {
    id: string;
    projectId: string; // From projet_id
    firstName: string; // From first_name
    lastName: string; // From last_name
    email: string;
    phone: string;
    function: string;
    companyRole: CompanyRole; // From company_role
}

export interface Historique {
    id: string;
    projectId: string; // From projet_id
    idActionRef: string; // From id_action_ref
    dateLog: string; // From date_log
    typeEvenement: TypeEvenement; // From type_evenement
    evenementDetail: string; // From evenement_detail, was description
}

export interface NonConformiteMineure {
    id: string; // was idNonConformite
    projectId: string;
    idActionRef: string;
    typeNonConformite: string;
    description: string;
    respAction: string;
    dateConstat: string;
    statut: 'Ouverte' | 'Clôturée';
    dateCloture?: string | null;
    photoUrl?: string | null;
}

export interface QualiteHSE {
    id: string; // was idQualite
    projectId: string;
    typeDocument: string;
    lotAssocie: string;
    statutFinal: 'En cours' | 'MAJ Requise' | 'Clôturé';
    majSatisfaite: boolean;
    lienControleSigne: string;
}

export interface Echantillon {
    id: string; // was idEchantillon
    projectId: string; // From projet_id
    nomProduit: string; // From nom_produit
    marqueModeleRef: string; // From marque_modele_ref
    respValidation: string; // NEW, from resp_validation
    statutValidation: 'Validé Avec Observation (VAO)' | 'Validé Sans Observation (VSO)' | 'Refusé' | 'À Livrer'; // From statut_validation
    conformiteCoupeFeu: string; // was boolean, from conformite_coupe_feu (text)
    lienCertificat: string; // From lien_certificat
}

export interface Commissioning {
    id: string; // was idJalonCx
    projectId: string; // From projet_id
    jalonCx: string; // From jalon_cx
    datePrevue: string; // was dDatePrevue, from date_prevue
    dateReelle: string | null; // was dDateReelle, from date_reelle
    scriptsValide: boolean; // From scripts_valide
    materielEtalonnage: string; // was boolean, from materiel_etalonnage (text)
    statutDoe: 'À Soumettre' | 'En Revue' | 'Clôturé'; // From statut_doe
}

// Fix: Add View type definition for navigation.
export type View = 'dashboard' | 'kanban' | 'compliance' | 'non-conformites' | 'mom-generator' | 'meeting' | 'settings';