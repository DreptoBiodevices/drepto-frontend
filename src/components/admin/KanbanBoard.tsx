// @ts-nocheck
import React, { useState } from 'react';
import { Project, Task } from './ProjectData';

interface KanbanBoardProps {
    project: Project | null;
    onUpdate: (project: Project) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ project, onUpdate }) => {
    if (!project) return null;

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskAssignee, setNewTaskAssignee] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const columns = [
        { id: 'todo', label: 'To Do', color: 'bg-gray-50/50 border-gray-100', dot: 'bg-gray-400' },
        { id: 'inprogress', label: 'In Progress', color: 'bg-blue-50/50 border-blue-100', dot: 'bg-blue-500' },
        { id: 'done', label: 'Done', color: 'bg-green-50/50 border-green-100', dot: 'bg-green-500' }
    ];

    const getTasksByStatus = (status: string) => {
        return (project.tasks || []).filter(t => t.status === status);
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const newTask: Task = {
            id: `t-${Date.now()}`,
            title: newTaskTitle,
            assignee: newTaskAssignee || 'Unassigned',
            status: 'todo'
        };

        const updatedProject = {
            ...project,
            tasks: [...(project.tasks || []), newTask]
        };

        onUpdate(updatedProject);
        setNewTaskTitle('');
        setNewTaskAssignee('');
        setIsAdding(false);
    };

    const moveTask = (taskId: string, newStatus: Task['status']) => {
        const updatedTasks = project.tasks.map(t =>
            t.id === taskId ? { ...t, status: newStatus } : t
        );
        onUpdate({ ...project, tasks: updatedTasks });
    };

    const deleteTask = (taskId: string) => {
        if (!confirm('Delete this task?')) return;
        const updatedTasks = project.tasks.filter(t => t.id !== taskId);
        onUpdate({ ...project, tasks: updatedTasks });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{project.name} <span className="text-gray-400 font-normal">/ Tasks</span></h2>
                    <p className="text-sm text-gray-500">Drag and drop tasks to change status (simulated with clicks)</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                    {isAdding ? 'Close Form' : '+ Add Task'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddTask} className="bg-white p-4 rounded-xl border shadow-sm flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Task Title</label>
                        <input autoFocus value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="e.g. Call Vendor" />
                    </div>
                    <div className="w-48">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Assignee</label>
                        <input value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="Name" />
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm h-[38px]">
                        Add
                    </button>
                </form>
            )}

            <div className="grid md:grid-cols-3 gap-6 overflow-x-auto pb-4">
                {columns.map(col => (
                    <div key={col.id} className={`rounded-xl p-4 ${col.color} min-w-[280px]`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-700">{col.label}</h3>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500 shadow-sm">
                                {getTasksByStatus(col.id).length}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {getTasksByStatus(col.id).map(task => (
                                <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm border border-transparent hover:border-primary/20 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-gray-800 font-medium text-sm">{task.title}</p>
                                        <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            ×
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                                            👤 {task.assignee}
                                        </span>
                                    </div>

                                    {/* Quick move buttons */}
                                    <div className="mt-3 pt-2 border-t flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        {col.id !== 'todo' && (
                                            <button onClick={() => moveTask(task.id, 'todo')} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                                                ← To Do
                                            </button>
                                        )}
                                        {col.id !== 'inprogress' && (
                                            <button onClick={() => moveTask(task.id, 'inprogress')} className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                                {col.id === 'todo' ? 'Start →' : '← Return'}
                                            </button>
                                        )}
                                        {col.id !== 'done' && (
                                            <button onClick={() => moveTask(task.id, 'done')} className="text-[10px] bg-green-50 hover:bg-green-100 text-green-600 px-2 py-1 rounded">
                                                Done ✓
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {getTasksByStatus(col.id).length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-xs italic">
                                    No tasks
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;
