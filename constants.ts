// Fix: Added .ts extension to types import.
import { StatutKanban } from './types.ts';

export const KANBAN_COLUMNS: StatutKanban[] = [
    StatutKanban.A_SOUMETTRE,
    StatutKanban.EN_REVUE_MOE,
    StatutKanban.VALIDÉ_AVEC_OBSERVATION_VAO,
    StatutKanban.VALIDE_VSO,
    StatutKanban.CLOTURE,
];