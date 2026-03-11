/**
 * milestoneDetector.js
 * AI-powered construction milestone detection using weighted keyword matching.
 * Detects construction milestones from natural-language contractor report text.
 * Tolerates spelling variations, synonyms, and partial phrases.
 */

// ─── Milestone Keyword Dictionary ───────────────────────────────────────────
// Each milestone has:
//   keywords  - individual words (each hit scores 1)
//   phrases   - multi-word phrase hits (each scores 2, higher confidence)
//   completed - words/phrases that indicate work is DONE (multiplier x2)
//   started   - words that indicate work has STARTED (multiplier x1)
// Threshold: score >= 3  → Completed | score >= 1.5 → In Progress

const MILESTONES = [
    {
        id: 'site_preparation',
        label: 'Site Preparation',
        keywords: ['site', 'clearing', 'leveling', 'levelling', 'grading', 'demarcation',
            'hoarding', 'fencing', 'survey', 'setting', 'layout', 'marking',
            'excavation', 'earthwork', 'topsoil', 'vegetation', 'debris', 'clearing'],
        phrases: ['site preparation', 'site clearing', 'land clearing', 'site leveling',
            'site layout', 'soil testing', 'site survey', 'ground preparation',
            'site marking', 'area leveling', 'preliminary work', 'pre-construction'],
    },
    {
        id: 'foundation',
        label: 'Foundation',
        keywords: ['foundation', 'footing', 'footings', 'pcc', 'plain cement', 'raft',
            'pile', 'piling', 'bored', 'caisson', 'basement', 'substructure',
            'bedrock', 'bearing', 'shallow', 'deep', 'isolated', 'combined'],
        phrases: ['foundation work', 'foundation completed', 'foundation laid',
            'footing and foundation', 'foundation concrete', 'foundation poured',
            'footing work', 'raft foundation', 'pile foundation', 'foundation done',
            'foundation ready', 'concrete foundation', 'foundation casting'],
    },
    {
        id: 'plinth',
        label: 'Plinth',
        keywords: ['plinth', 'plinth beam', 'plinth level', 'damp proof', 'dpc',
            'ground beam', 'tie beam', 'slab on grade', 'grade beam'],
        phrases: ['plinth beam', 'plinth level', 'plinth work', 'damp proof course',
            'plinth completed', 'plinth construction', 'plinth casting'],
    },
    {
        id: 'structural_frame',
        label: 'Structural Frame (Columns, Beams, Slabs)',
        keywords: ['column', 'columns', 'beam', 'beams', 'slab', 'slabs', 'structural',
            'frame', 'framework', 'rcc', 'reinforced', 'concrete', 'formwork',
            'shuttering', 'casting', 'rebar', 'steel', 'stirrup', 'lintel',
            'sunshade', 'chajja', 'cantilever', 'floor slab', 'roof slab'],
        phrases: ['structural frame', 'columns and beams', 'beam and slab', 'rcc frame',
            'column casting', 'slab casting', 'concrete casting', 'column work',
            'beam work', 'slab work', 'frame completed', 'structural work',
            'column poured', 'slab poured', 'reinforcement work', 'rcc work',
            'concrete frame', 'structural steel', 'column formwork'],
    },
    {
        id: 'wall_construction',
        label: 'Wall Construction',
        keywords: ['wall', 'walls', 'brick', 'brickwork', 'masonry', 'block', 'blocks',
            'partition', 'blockwork', 'mortar', 'AAC', 'hollow', 'retaining',
            'exterior wall', 'interior wall', 'cavity', 'cladding'],
        phrases: ['wall construction', 'brick laying', 'brickwork completed',
            'masonry work', 'wall raising', 'block work', 'wall work',
            'wall done', 'walls completed', 'partition walls', 'wall casting',
            'brick masonry', 'block masonry', 'AAC block', 'wall built'],
    },
    {
        id: 'roofing',
        label: 'Roofing',
        keywords: ['roof', 'roofing', 'terrace', 'waterproofing', 'insulation',
            'parapet', 'gutter', 'drainage', 'skylight', 'ceiling', 'truss',
            'tile', 'membrane', 'felt', 'metal roof', 'flat roof', 'pitched'],
        phrases: ['roof slab', 'roof casting', 'roof completed', 'roofing work',
            'terrace slab', 'roof done', 'waterproofing done', 'roof laid',
            'roofing completed', 'roof structure', 'roof work', 'terrace done'],
    },
    {
        id: 'plastering',
        label: 'Plastering',
        keywords: ['plaster', 'plastering', 'rendering', 'putty', 'skimming', 'stucco',
            'pointing', 'roughcast', 'cement plaster', 'smooth', 'internal',
            'external', 'wall finish', 'surface', 'coat'],
        phrases: ['plaster work', 'plastering completed', 'plastering done',
            'wall plastering', 'internal plastering', 'external plastering',
            'cement plastering', 'plastering started', 'putty work', 'rendering done'],
    },
    {
        id: 'flooring',
        label: 'Flooring',
        keywords: ['floor', 'flooring', 'tile', 'tiling', 'marble', 'granite', 'ceramic',
            'vitrified', 'wood', 'hardwood', 'laminate', 'vinyl', 'carpet',
            'screed', 'epoxy', 'skirting', 'threshold', 'anti-skid'],
        phrases: ['floor tiling', 'tile fixing', 'flooring work', 'floor done',
            'tiling completed', 'floor completed', 'marble flooring',
            'granite flooring', 'flooring done', 'tile work', 'floor laid',
            'floor finish', 'vitrified tiles', 'floor screed'],
    },
    {
        id: 'electrical_plumbing',
        label: 'Electrical & Plumbing',
        keywords: ['electrical', 'electric', 'wiring', 'plumbing', 'pipe', 'piping',
            'conduit', 'circuit', 'switchboard', 'socket', 'switch', 'panel',
            'mcb', 'fitting', 'sanitary', 'drainage', 'sewage', 'water supply',
            'AC', 'hvac', 'duct', 'concealed', 'earthing', 'tank', 'overhead'],
        phrases: ['electrical work', 'plumbing work', 'electrical wiring',
            'pipe laying', 'conduit work', 'electrical completed', 'plumbing done',
            'wiring done', 'electrical fittings', 'sanitary work', 'water line',
            'electrical and plumbing', 'MEP work', 'plumbing completed',
            'electrical installation', 'wiring completed'],
    },
    {
        id: 'finishing_works',
        label: 'Finishing Works',
        keywords: ['finishing', 'finish', 'painting', 'paint', 'polish', 'varnish',
            'door', 'doors', 'window', 'windows', 'grille', 'hardware',
            'fixture', 'fixtures', 'handle', 'lock', 'handrail', 'staircase',
            'false ceiling', 'gypsum', 'modular', 'kitchen', 'landscaping',
            'compound', 'driveway', 'handover', 'handover ready', 'completion'],
        phrases: ['finishing work', 'final finishing', 'door and window', 'painting done',
            'paint work', 'finishing completed', 'doors and windows',
            'interior finishing', 'exterior finishing', 'final touches',
            'handover ready', 'project completion', 'work completed',
            'painting completed', 'final painting'],
    },
];

// ─── Completion / Progress Signal Words ─────────────────────────────────────
const COMPLETED_SIGNALS = [
    'completed', 'complete', 'done', 'finished', 'over', 'accomplished',
    'achieved', 'ready', 'poured', 'laid', 'cast', 'raised', 'built',
    'installed', 'fixed', 'erected', 'set', 'finished off', 'wrapped up',
    'handed over', 'signed off', 'closed out', 'finalised', 'finalized',
];

const PROGRESS_SIGNALS = [
    'started', 'beginning', 'commenced', 'underway', 'ongoing', 'in progress',
    'proceeding', 'progressing', 'partially', 'phase', 'halfway', 'working on',
    'continuing', 'ongoing', 'partially done', '50%', '80%', 'percent',
];

// ─── Normalise text ───────────────────────────────────────────────────────────
function normalise(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')   // strip punctuation
        .replace(/\s+/g, ' ')
        .trim();
}

// ─── Score a single milestone against the text ───────────────────────────────
function scoreMilestone(milestone, normText) {
    let keywordHits = 0;
    let phraseHits = 0;

    milestone.keywords.forEach(kw => {
        // word-boundary match
        const re = new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}\\b`, 'i');
        if (re.test(normText)) keywordHits++;
    });

    milestone.phrases.forEach(ph => {
        const re = new RegExp(ph.replace(/\s+/g, '\\s+'), 'i');
        if (re.test(normText)) phraseHits++;
    });

    return keywordHits * 1 + phraseHits * 2;
}

// ─── Determine completion state ───────────────────────────────────────────────
function detectCompletionState(normText) {
    const hasCompleted = COMPLETED_SIGNALS.some(s =>
        new RegExp(`\\b${s}\\b`, 'i').test(normText)
    );
    const hasStarted = PROGRESS_SIGNALS.some(s =>
        new RegExp(`\\b${s}\\b`, 'i').test(normText)
    );

    if (hasCompleted) return 'Completed';
    if (hasStarted) return 'In Progress';
    return 'In Progress'; // any milestone mention defaults to in-progress
}

// ─── Main detection function ──────────────────────────────────────────────────
/**
 * detectMilestones(reportText)
 * @param {string} reportText - The raw contractor report text
 * @returns {Array<{ milestoneId: string, label: string, status: 'Completed' | 'In Progress', confidence: number }>}
 */
function detectMilestones(reportText) {
    const normText = normalise(reportText);
    const detectionState = detectCompletionState(normText);
    const results = [];

    for (const milestone of MILESTONES) {
        const score = scoreMilestone(milestone, normText);

        if (score >= 3) {
            results.push({
                milestoneId: milestone.id,
                label: milestone.label,
                status: detectionState,
                confidence: Math.min(1, score / 8), // normalised 0–1
            });
        } else if (score >= 1.5) {
            results.push({
                milestoneId: milestone.id,
                label: milestone.label,
                status: 'In Progress',
                confidence: Math.min(1, score / 8),
            });
        }
    }

    // Sort by confidence descending
    results.sort((a, b) => b.confidence - a.confidence);
    return results;
}

module.exports = { detectMilestones, MILESTONES };
