export interface Task {
    id: string;
    title: string;
    assignee: string;
    status: 'todo' | 'inprogress' | 'done' | 'pending';
    startDate?: string;
    endDate?: string;
    type?: 'phase' | 'sub-phase' | 'milestone' | 'task';
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
    startDate: string;
    endDate: string;
    team: string[];
    tasks: Task[];
    progress: number;
}

const STORAGE_KEY = 'admin_projects';

// Seed data
const initialProjects: Project[] = [
    {
        id: 'p-2',
        name: 'Methotrexate Transdermal Patch',
        description: 'End-to-end development of Methotrexate Transdermal Patch from formulation to commercial launch.',
        status: 'In Progress',
        startDate: '2025-12-01',
        endDate: '2028-12-31',
        team: ['Dr. Formulation', 'Dr. Clinical', 'Reg. Affairs', 'Ops Manager'],
        progress: 10,
        tasks: [
            // Phase 1
            { id: 'ph-1', title: 'Phase 1: Pre-Formulation & Formulation Development', assignee: 'Dr. Formulation', status: 'done', startDate: '2025-12-01', endDate: '2025-12-31', type: 'phase' },

            // Phase 2
            { id: 'ph-2', title: 'Phase 2: Analytical Method Development & Validation', assignee: 'QA Core', status: 'todo', startDate: '2026-01-01', endDate: '2026-02-28', type: 'phase' },

            // Phase 3
            { id: 'ph-3', title: 'Phase 3: Preclinical Studies', assignee: 'Dr. Clinical', status: 'todo', startDate: '2026-03-01', endDate: '2026-07-31', type: 'phase' },
            { id: 'ph-3-1', title: 'In-Vitro / Ex-Vivo Studies', assignee: 'Lab Team', status: 'todo', startDate: '2026-03-01', endDate: '2026-04-30', type: 'sub-phase' },
            { id: 'ph-3-2', title: 'In-Vivo Studies', assignee: 'Lab Team', status: 'todo', startDate: '2026-04-01', endDate: '2026-07-31', type: 'sub-phase' },

            // Reg & Scale Up
            { id: 'reg-pre-clin', title: 'Regulatory Phase (Pre-Clinical)', assignee: 'Reg. Affairs', status: 'todo', startDate: '2026-08-01', endDate: '2026-10-31', type: 'phase' },
            { id: 'mfg-scale', title: 'Manufacturing Scale-Up', assignee: 'Ops Manager', status: 'todo', startDate: '2026-10-01', endDate: '2026-12-31', type: 'phase' },

            // Phase 4
            { id: 'ph-4', title: 'Phase 4: Clinical Studies', assignee: 'Dr. Clinical', status: 'todo', startDate: '2027-01-01', endDate: '2028-04-30', type: 'phase' },
            { id: 'ph-4-1', title: 'Clinical Phase I', assignee: 'Dr. Clinical', status: 'todo', startDate: '2027-01-01', endDate: '2027-02-28', type: 'sub-phase' },
            { id: 'ph-4-2', title: 'Clinical Phase II', assignee: 'Dr. Clinical', status: 'todo', startDate: '2027-03-01', endDate: '2027-08-31', type: 'sub-phase' },
            { id: 'ph-4-3', title: 'Clinical Phase III', assignee: 'Dr. Clinical', status: 'todo', startDate: '2027-09-01', endDate: '2028-04-30', type: 'sub-phase' },

            // Final
            { id: 'reg-sub', title: 'Regulatory Submission & Approval', assignee: 'Reg. Affairs', status: 'todo', startDate: '2028-04-01', endDate: '2028-09-30', type: 'milestone' },
            { id: 'launch', title: 'Commercial Manufacturing & Launch', assignee: 'Ops Manager', status: 'todo', startDate: '2028-10-01', endDate: '2028-12-31', type: 'milestone' }
        ]
    },
    {
        id: 'p-3',
        name: 'Transdermal Patch for Menstrual Pain',
        description: 'Mefenamic Acid + Dicyclomine OTC Patch. CT Waived path for accelerated launch.',
        status: 'In Progress',
        startDate: '2025-12-01',
        endDate: '2027-06-30',
        team: ['Dr. Formulation', 'Reg. Affairs', 'Ops Manager'],
        progress: 15,
        tasks: [
            // Phase 1
            { id: 'p3-ph-1', title: 'Phase 1: Pre-Formulation & Formulation Development', assignee: 'Dr. Formulation', status: 'done', startDate: '2025-12-01', endDate: '2025-12-31', type: 'phase' },

            // Phase 2
            { id: 'p3-ph-2', title: 'Phase 2: Analytical Method Development', assignee: 'QA Core', status: 'todo', startDate: '2026-01-01', endDate: '2026-02-28', type: 'phase' },

            // Phase 3
            { id: 'p3-ph-3', title: 'Phase 3: Preclinical Studies (Safety/Efficacy)', assignee: 'Lab Team', status: 'todo', startDate: '2026-03-01', endDate: '2026-07-31', type: 'phase' },

            // Regulatory (CT Waived)
            { id: 'p3-reg', title: 'Regulatory & Licensing (CT Waived)', assignee: 'Reg. Affairs', status: 'todo', startDate: '2026-08-01', endDate: '2026-10-31', type: 'phase' },
            { id: 'p3-dossier', title: 'Dossier Compilation (Class C/D & Form 29)', assignee: 'Reg. Affairs', status: 'todo', startDate: '2026-08-15', endDate: '2026-09-30', type: 'milestone' },

            // Manufacturing
            { id: 'p3-mfg', title: 'Manufacturing Scale-Up', assignee: 'Ops Manager', status: 'todo', startDate: '2026-10-01', endDate: '2026-12-31', type: 'phase' },

            // Launch
            { id: 'p3-launch', title: 'Final Approval & Market Launch', assignee: 'Ops Manager', status: 'todo', startDate: '2027-01-01', endDate: '2027-06-30', type: 'milestone' }
        ]
    }
];

// --- Templates ---

const addMonths = (dateStr: string, months: number): string => {
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
};

const generateTenStageTasks = (projectId: string, start: string): Task[] => {
    // 24 Month Timeline
    const stages = [
        { title: '1. Literature Review & Concept', duration: 2, assignee: 'R&D Lead' },
        { title: '2. Feasibility Study', duration: 2, assignee: 'R&D Team' },
        { title: '3. Design & Simulation', duration: 3, assignee: 'Engineering' },
        { title: '4. Prototype Development', duration: 3, assignee: 'Engineering' },
        { title: '5. In-Vitro / Lab Testing', duration: 3, assignee: 'Lab Team' },
        { title: '6. Refinement & Optimization', duration: 3, assignee: 'R&D Team' },
        { title: '7. Validation Studies', duration: 3, assignee: 'QA Core' },
        { title: '8. Regulatory Assessment', duration: 2, assignee: 'Reg. Affairs' },
        { title: '9. Pilot Production / Fabrication', duration: 2, assignee: 'Ops Manager' },
        { title: '10. Final Report & Tech Transfer', duration: 1, assignee: 'Project Lead' },
    ];

    let currentStart = start;
    return stages.map((stage, idx) => {
        const end = addMonths(currentStart, stage.duration);
        const task: Task = {
            id: `${projectId}-s${idx + 1}`,
            title: stage.title,
            assignee: stage.assignee,
            status: 'todo',
            startDate: currentStart,
            endDate: end,
            type: 'phase'
        };
        currentStart = end; // Sequential
        return task;
    });
};

const generate52MonthTasks = (projectId: string, start: string): Task[] => {
    // 52 Month Standardized Patch Timeline
    // Based on Methotrexate structure but standardized
    const phases = [
        { title: 'Phase 1: Pre-Formulation & Formulation', duration: 6, assignee: 'Dr. Formulation', type: 'phase' },
        { title: 'Phase 2: Analytical Method Dev & Val', duration: 6, assignee: 'QA Core', type: 'phase' },
        { title: 'Phase 3: Preclinical Studies', duration: 12, assignee: 'Dr. Clinical', type: 'phase' },
        { title: 'Phase 4-I: Clinical Phase I', duration: 6, assignee: 'Dr. Clinical', type: 'sub-phase' },
        { title: 'Phase 4-II: Clinical Phase II', duration: 12, assignee: 'Dr. Clinical', type: 'sub-phase' },
        { title: 'Phase 4-III: Clinical Phase III', duration: 10, assignee: 'Dr. Clinical', type: 'sub-phase' },
        { title: 'Regulatory Submission & Approval', duration: 6, assignee: 'Reg. Affairs', type: 'milestone' },
        { title: 'Commercial Launch', duration: 3, assignee: 'Ops Manager', type: 'milestone' } // Bringing it to ~52-60 range
    ];

    let currentStart = start;
    return phases.map((phase, idx) => {
        const end = addMonths(currentStart, phase.duration);
        const task: Task = {
            id: `${projectId}-ph${idx + 1}`,
            title: phase.title,
            assignee: phase.assignee,
            status: 'todo',
            startDate: currentStart,
            endDate: end,
            type: phase.type as any
        };
        currentStart = end;
        return task;
    });
};

// --- New Projects Batch ---

const start2026 = '2026-01-01';

const newProjects: Project[] = [
    // Group 2: R&D Projects (Ten-Stage)
    {
        id: 'p-4',
        name: 'Sensor Electrode/Device',
        description: 'Development of advanced sensor electrodes for bio-monitoring applications.',
        status: 'Planning',
        startDate: start2026,
        endDate: addMonths(start2026, 24),
        team: ['Engineering', 'R&D Lead'],
        progress: 0,
        tasks: generateTenStageTasks('p-4', start2026)
    },
    {
        id: 'p-5',
        name: 'Antifouling Materials for Bio-devices',
        description: 'Research into novel materials to prevent bio-fouling in implantable devices.',
        status: 'Planning',
        startDate: start2026,
        endDate: addMonths(start2026, 24),
        team: ['R&D Team', 'QA Core'],
        progress: 0,
        tasks: generateTenStageTasks('p-5', start2026)
    },
    {
        id: 'p-6',
        name: 'Drug Repurposing / Reverse Pharmacology',
        description: 'Screening existing drugs for new therapeutic indications using reverse pharmacology.',
        status: 'Planning',
        startDate: start2026,
        endDate: addMonths(start2026, 24),
        team: ['R&D Lead', 'Dr. Clinical'],
        progress: 0,
        tasks: generateTenStageTasks('p-6', start2026)
    },

    // Group 3: Patch Projects (Standardized 52-Month)
    {
        id: 'p-7',
        name: 'Transdermal Patch: Methylphenidate',
        description: 'Development of Methylphenidate patch for ADHD.',
        status: 'Planning',
        startDate: start2026,
        endDate: addMonths(start2026, 52),
        team: ['Dr. Formulation', 'Dr. Clinical'],
        progress: 0,
        tasks: generate52MonthTasks('p-7', start2026)
    },
    {
        id: 'p-8',
        name: 'Transdermal Patch: Pregabalin',
        description: 'Development of Pregabalin patch for neuropathic pain.',
        status: 'Planning',
        startDate: start2026,
        endDate: addMonths(start2026, 52),
        team: ['Dr. Formulation', 'Dr. Clinical'],
        progress: 0,
        tasks: generate52MonthTasks('p-8', start2026)
    },
    {
        id: 'p-9',
        name: 'Transdermal Patch: Vigabatrin',
        description: 'Development of Vigabatrin patch for seizure control.',
        status: 'Planning',
        startDate: start2026,
        endDate: addMonths(start2026, 52),
        team: ['Dr. Formulation', 'Dr. Clinical'],
        progress: 0,
        tasks: generate52MonthTasks('p-9', start2026)
    },
    {
        id: 'p-10',
        name: 'Transdermal Patch: Gabapentin',
        description: 'Development of Gabapentin patch for postherpetic neuralgia.',
        status: 'Planning',
        startDate: start2026,
        endDate: addMonths(start2026, 52),
        team: ['Dr. Formulation', 'Dr. Clinical'],
        progress: 0,
        tasks: generate52MonthTasks('p-10', start2026)
    }
];

export const loadProjects = (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    // Combine all seed data
    const allSeeds = [...initialProjects, ...newProjects];

    if (!data) {
        saveProjects(allSeeds);
        return allSeeds;
    }

    // Improved Seeding: Check for any missing seed projects and add them
    const loaded = JSON.parse(data);
    let updated = false;

    allSeeds.forEach(seed => {
        if (!loaded.find((p: Project) => p.id === seed.id)) {
            loaded.push(seed);
            updated = true;
        }
    });

    if (updated) {
        saveProjects(loaded);
    }

    return loaded;
};

export const saveProjects = (projects: Project[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    // Dispatch event for listeners (like DashboardStats)
    window.dispatchEvent(new Event('projects:updated'));
};
