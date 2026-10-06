import React, { useState } from 'react';
import { Project, Task } from './ProjectData';

interface GanttProps {
    project: Project;
    onUpdate?: (project: Project) => void;
}

const ProjectGantt: React.FC<GanttProps> = ({ project, onUpdate }) => {
    const [compactMode, setCompactMode] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editForm, setEditForm] = useState<{ start: string; end: string }>({ start: '', end: '' });

    // Helper to calculate grid position
    const getTimelineHeaders = () => {
        if (!project.tasks.length) return [];

        const dates = project.tasks.map(t => [new Date(t.startDate || ''), new Date(t.endDate || '')]).flat();
        if (dates.length === 0) return [];

        const minDate = new Date(Math.min(...dates.filter(d => !isNaN(d.getTime())).map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.filter(d => !isNaN(d.getTime())).map(d => d.getTime())));

        // Add buffer
        minDate.setMonth(minDate.getMonth() - 1);
        maxDate.setMonth(maxDate.getMonth() + 2);

        const headers = [];
        const current = new Date(minDate);
        current.setDate(1);

        while (current <= maxDate) {
            headers.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }
        return headers;
    };

    const headers = getTimelineHeaders();
    const totalMonths = headers.length;

    const getGridStyle = (startStr?: string, endStr?: string): React.CSSProperties => {
        if (!startStr || !endStr || headers.length === 0) return {};

        const start = new Date(startStr);
        const end = new Date(endStr);
        const timelineStart = headers[0];

        const startMonthDiff = (start.getFullYear() - timelineStart.getFullYear()) * 12 + (start.getMonth() - timelineStart.getMonth());
        const durationMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;

        return {
            gridColumnStart: Math.max(1, startMonthDiff + 2),
            gridColumnEnd: `span ${Math.max(1, durationMonths)}`,
        };
    };

    const handleTaskClick = (task: Task) => {
        if (!onUpdate) return; // Read-only if no update handler
        setEditingTask(task);
        setEditForm({
            start: task.startDate || '',
            end: task.endDate || ''
        });
    };

    const saveTaskEdit = () => {
        if (!editingTask || !onUpdate) return;

        const updatedTasks = project.tasks.map(t =>
            t.id === editingTask.id
                ? { ...t, startDate: editForm.start, endDate: editForm.end }
                : t
        );

        // Update project dates if needed (optional optimization)

        onUpdate({ ...project, tasks: updatedTasks });
        setEditingTask(null);
    };

    if (headers.length === 0) {
        return <div className="p-10 text-center text-gray-500">No timeline data available. Ensure tasks have valid dates.</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
            {/* Toolbar */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-gray-800">{project.name}</h3>
                    <div className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                        {headers[0].toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - {headers[headers.length - 1].toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Density:</span>
                    <button
                        onClick={() => setCompactMode(false)}
                        className={`px-3 py-1 text-xs font-medium rounded-l-lg border ${!compactMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                    >
                        Standard
                    </button>
                    <button
                        onClick={() => setCompactMode(true)}
                        className={`px-3 py-1 text-xs font-medium rounded-r-lg border-t border-b border-r ${compactMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                    >
                        Compact
                    </button>
                </div>
            </div>

            {/* Timeline Grid */}
            <div className="overflow-auto flex-1 relative custom-scrollbar">
                <div
                    className="grid gap-y-2 p-4 min-w-[max-content]"
                    style={{
                        gridTemplateColumns: `250px repeat(${totalMonths}, minmax(${compactMode ? '20px' : '40px'}, 1fr))`
                    }}
                >
                    {/* Header Row */}
                    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b pb-2 font-bold text-gray-600 text-xs uppercase tracking-wider col-span-full grid" style={{ gridTemplateColumns: `subgrid` }}>
                        <div className="sticky left-0 bg-white z-20 pl-2 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Task Name</div>
                        {headers.map((date, i) => (
                            <div key={i} className="text-center border-l border-gray-100 px-1 truncate text-[10px]">
                                {compactMode
                                    ? (i % 3 === 0 ? date.toLocaleDateString(undefined, { month: 'narrow' }) : '') // Show fewer labels in compact
                                    : date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
                                }
                            </div>
                        ))}
                    </div>

                    {/* Task Rows */}
                    {project.tasks.map((task) => (
                        <div key={task.id} className="contents group hover:bg-gray-50">
                            <div className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 py-2 pr-4 border-r border-gray-100 text-sm font-medium text-gray-700 truncate flex items-center gap-2 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-green-500' :
                                        task.status === 'inprogress' ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}></span>
                                <span title={task.title} className="truncate">{task.title}</span>
                            </div>

                            {/* Gantt Bar */}
                            <div
                                onClick={() => handleTaskClick(task)}
                                className={`
                                    relative my-1 rounded-md shadow-sm flex items-center px-2 text-[10px] text-white font-bold truncate transition-all hover:opacity-90 cursor-pointer hover:ring-2 ring-offset-1 ring-indigo-400
                                    ${task.type === 'phase' ? 'bg-indigo-500 h-8 rounded-lg' :
                                        task.type === 'sub-phase' ? 'bg-blue-400 h-6 mt-1' :
                                            task.type === 'milestone' ? 'bg-amber-500 h-6 mt-1' : 'bg-gray-400 h-4 mt-2'
                                    }
                                `}
                                style={getGridStyle(task.startDate, task.endDate)}
                                title={`${task.title}\n${task.startDate} - ${task.endDate}\nClick to Edit`}
                            >
                                {!compactMode && task.title}
                            </div>

                            {/* Grid Lines for this row */}
                            {headers.map((_, i) => (
                                <div key={i} className="border-l border-gray-100 h-full -z-10 row-start-auto" style={{ gridColumn: i + 2, gridRow: 'auto' }}></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            {editingTask && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Timeline</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
                            <div className="p-2 bg-gray-50 rounded text-gray-800 text-sm">{editingTask.title}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={editForm.start}
                                    onChange={e => setEditForm({ ...editForm, start: e.target.value })}
                                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={editForm.end}
                                    onChange={e => setEditForm({ ...editForm, end: e.target.value })}
                                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingTask(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveTaskEdit}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectGantt;
