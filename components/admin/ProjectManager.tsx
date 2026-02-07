// // @ts-nocheck
// import React, { useState, useEffect } from 'react';
// import { Project, loadProjects, saveProjects } from './ProjectData';
// import ProjectForm from './ProjectForm';
// import KanbanBoard from './KanbanBoard';

// import ProjectGantt from './ProjectGantt';

// const ProjectManager = () => {
//     const [projects, setProjects] = useState<Project[]>([]);
//     const [view, setView] = useState<'list' | 'form' | 'board' | 'timeline'>('list');
//     const [activeProject, setActiveProject] = useState<Project | null>(null);

//     // useEffect removed as per user request to disable API calling
//     // useEffect(() => {
//     //     setProjects(loadProjects());
//     // }, [view]);

//     const handleCreate = () => {
//         setActiveProject(null);
//         setView('form');
//     };

//     const handleEdit = (p: Project) => {
//         setActiveProject(p);
//         setView('form');
//     };

//     const handleManage = (p: Project) => {
//         setActiveProject(p);
//         setView('board');
//     };

//     const handleTimeline = (p: Project) => {
//         setActiveProject(p);
//         setView('timeline');
//     };

//     const handleDelete = (id: string) => {
//         if (confirm('Are you sure you want to delete this project?')) {
//             const next = projects.filter(p => p.id !== id);
//             setProjects(next);
//             saveProjects(next);
//         }
//     };

//     const handleSave = (p: Project) => {
//         let next = [...projects];
//         if (activeProject) {
//             // Edit
//             const idx = next.findIndex(item => item.id === p.id);
//             if (idx !== -1) next[idx] = p;
//         } else {
//             // Create
//             next.unshift(p);
//         }
//         setProjects(next);
//         saveProjects(next);
//         setView('list');
//     };

//     const BackButton = () => (
//         <button
//             onClick={() => setView('list')}
//             className="mb-4 text-sm text-gray-500 hover:text-primary flex items-center gap-1"
//         >
//             ← Back to Projects
//         </button>
//     );

//     if (view === 'form') {
//         return (
//             <div>
//                 <BackButton />
//                 <ProjectForm initialData={activeProject} onSave={handleSave} onCancel={() => setView('list')} />
//             </div>
//         );
//     }

//     if (view === 'board') {
//         return (
//             <div>
//                 <BackButton />
//                 <KanbanBoard project={activeProject} onUpdate={handleSave} />
//             </div>
//         );
//     }

//     if (view === 'timeline') {
//         return (
//             <div>
//                 <BackButton />
//                 <ProjectGantt project={activeProject!} onUpdate={handleSave} />
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold text-gray-800">Projects</h2>
//                 <button onClick={handleCreate} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
//                     + New Project
//                 </button>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {projects.map(p => (
//                     <div key={p.id} className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
//                         <div className="flex justify-between items-start mb-2">
//                             <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
//                                 p.status === 'Completed' ? 'bg-green-100 text-green-700' :
//                                     'bg-gray-100 text-gray-700'
//                                 }`}>
//                                 {p.status}
//                             </span>
//                             <div className="flex gap-2">
//                                 <button onClick={() => requestAnimationFrame(() => handleEdit(p))} className="text-gray-400 hover:text-blue-600" title="Edit">
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
//                                 </button>
//                                 <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600" title="Delete">
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//                                 </button>
//                             </div>
//                         </div>

//                         <h3 className="font-bold text-lg mb-1">{p.name}</h3>
//                         <p className="text-sm text-gray-500 mb-4 line-clamp-2">{p.description}</p>

//                         <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
//                             <span>{p.team.length} Team Members</span>
//                             <span>{p.startDate} - {p.endDate}</span>
//                         </div>

//                         <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
//                             <div className="bg-primary h-2 rounded-full" style={{ width: `${p.progress}%` }}></div>
//                         </div>

//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => handleManage(p)}
//                                 className="flex-1 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 font-medium text-sm"
//                             >
//                                 Tasks
//                             </button>
//                             <button
//                                 onClick={() => handleTimeline(p)}
//                                 className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium text-sm flex items-center justify-center gap-1"
//                             >
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
//                                 Timeline
//                             </button>
//                         </div>
//                     </div>
//                 ))}

//                 {projects.length === 0 && (
//                     <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed">
//                         <p>No projects yet. Create one to get started.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProjectManager;
