import type { Project, Action, Contact, Historique, NonConformiteMineure, QualiteHSE, Echantillon, Commissioning } from '../types.ts';
import { StatutKanban } from '../types.ts';

const isValidStatut = (statut: any): statut is StatutKanban => Object.values(StatutKanban).includes(statut);

// DB to App State (snake_case to camelCase)
export const dbToProject = (db: any): Project => ({ id: db.id, nomProjet: db.nom_projet });
export const dbToAction = (db: any): Action => ({
    id: db.id,
    projectId: db.projet_id,
    nomLivrable: db.nom_livrable,
    lotTechnique: db.lot_technique,
    indiceVersion: db.indice_version,
    respExecution: db.resp_execution,
    respValidationPpl: db.resp_validation_ppl,
    dateLimiteInit: db.date_limite_init,
    derniereLimite: db.derniere_limite,
    statutKanban: isValidStatut(db.statut_kanban) ? db.statut_kanban : StatutKanban.A_SOUMETTRE,
    criticiteAlerte: db.criticite_alerte,
    causeGlissement: db.cause_glissement,
    commentaireStatut: db.commentaire_statut,
    lienDriveDoc: db.lien_drive_doc,
    lienFicheVisa: db.lien_fiche_visa,
    nombreReports: db.nombre_reports,
});
export const dbToContact = (db: any): Contact => ({
    id: db.id,
    projectId: db.projet_id,
    firstName: db.first_name,
    lastName: db.last_name,
    email: db.email,
    phone: db.phone,
    function: db.function,
    companyRole: db.company_role,
});
export const dbToHistorique = (db: any): Historique => ({
    id: db.id,
    projectId: db.projet_id,
    idActionRef: db.id_action_ref,
    dateLog: db.date_log,
    typeEvenement: db.type_evenement,
    evenementDetail: db.evenement_detail,
});
export const dbToNonConformite = (db: any): NonConformiteMineure => ({
    id: db.id,
    projectId: db.projet_id,
    idActionRef: db.id_action_ref,
    typeNonConformite: db.type_non_conformite,
    description: db.description,
    respAction: db.resp_action,
    dateConstat: db.date_constat,
    statut: db.statut,
    dateCloture: db.date_cloture,
});
export const dbToQualiteHSE = (db: any): QualiteHSE => ({
    id: db.id,
    projectId: db.projet_id,
    typeDocument: db.type_document,
    lotAssocie: db.lot_associe,
    statutFinal: db.statut_final,
    majSatisfaite: db.maj_satisfaite,
    lienControleSigne: db.lien_controle_signe,
});
export const dbToEchantillon = (db: any): Echantillon => ({
    id: db.id,
    projectId: db.projet_id,
    nomProduit: db.nom_produit,
    marqueModeleRef: db.marque_modele_ref,
    respValidation: db.resp_validation,
    statutValidation: db.statut_validation,
    conformiteCoupeFeu: db.conformite_coupe_feu,
    lienCertificat: db.lien_certificat,
});
export const dbToCommissioning = (db: any): Commissioning => ({
    id: db.id,
    projectId: db.projet_id,
    jalonCx: db.jalon_cx,
    datePrevue: db.date_prevue,
    dateReelle: db.date_reelle,
    scriptsValide: db.scripts_valide,
    materielEtalonnage: db.materiel_etalonnage,
    statutDoe: db.statut_doe,
});

// App State to DB (camelCase to snake_case)
export const projectToDb = (p: Project) => ({ id: p.id, nom_projet: p.nomProjet });
export const actionToDb = (a: Action | Omit<Action, 'id'>) => ({
    ...('id' in a && { id: a.id }),
    projet_id: a.projectId,
    nom_livrable: a.nomLivrable,
    lot_technique: a.lotTechnique,
    indice_version: a.indiceVersion,
    resp_execution: a.respExecution,
    resp_validation_ppl: a.respValidationPpl,
    date_limite_init: a.dateLimiteInit,
    derniere_limite: a.derniereLimite,
    statut_kanban: a.statutKanban,
    criticite_alerte: a.criticiteAlerte,
    cause_glissement: a.causeGlissement,
    commentaire_statut: a.commentaireStatut,
    lien_drive_doc: a.lienDriveDoc,
    lien_fiche_visa: a.lienFicheVisa,
    nombre_reports: a.nombreReports,
});
export const contactToDb = (c: Contact | Omit<Contact, 'id'>) => ({
    ...('id' in c && { id: c.id }),
    projet_id: c.projectId,
    first_name: c.firstName,
    last_name: c.lastName,
    email: c.email,
    phone: c.phone,
    function: c.function,
    company_role: c.companyRole,
});
export const historiqueToDb = (h: Historique | Omit<Historique, 'id'>) => ({
    ...('id' in h && { id: h.id }),
    projet_id: h.projectId,
    id_action_ref: h.idActionRef,
    date_log: h.dateLog,
    type_evenement: h.typeEvenement,
    evenement_detail: h.evenementDetail,
});
export const nonConformiteToDb = (nc: NonConformiteMineure) => ({
    id: nc.id,
    projet_id: nc.projectId,
    id_action_ref: nc.idActionRef,
    type_non_conformite: nc.typeNonConformite,
    description: nc.description,
    resp_action: nc.respAction,
    date_constat: nc.dateConstat,
    statut: nc.statut,
    date_cloture: nc.dateCloture,
});
export const qualiteHSEToDb = (q: QualiteHSE) => ({
    id: q.id,
    projet_id: q.projectId,
    type_document: q.typeDocument,
    lot_associe: q.lotAssocie,
    statut_final: q.statutFinal,
    maj_satisfaite: q.majSatisfaite,
    lien_controle_signe: q.lienControleSigne,
});
export const echantillonToDb = (e: Echantillon) => ({
    id: e.id,
    projet_id: e.projectId,
    nom_produit: e.nomProduit,
    marque_modele_ref: e.marqueModeleRef,
    resp_validation: e.respValidation,
    statut_validation: e.statutValidation,
    conformite_coupe_feu: e.conformiteCoupeFeu,
    lien_certificat: e.lienCertificat,
});
export const commissioningToDb = (c: Commissioning) => ({
    id: c.id,
    projet_id: c.projectId,
    jalon_cx: c.jalonCx,
    date_prevue: c.datePrevue,
    date_reelle: c.dateReelle,
    scripts_valide: c.scriptsValide,
    materiel_etalonnage: c.materielEtalonnage,
    statut_doe: c.statutDoe,
});