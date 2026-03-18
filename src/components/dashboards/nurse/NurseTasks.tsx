
import React, { useState } from 'react';

interface Task {
    id: string;
    description: string;
    patientName: string;
    time: string;
    status: 'Pending' | 'Completed';
    priority: 'High' | 'Medium' | 'Low';
}

const NurseTasks: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    
    // Dynamic State for Tasks
    const [tasks, setTasks] = useState<Task[]>([]);
    
    // New Task Form State
    const [newTask, setNewTask] = useState({ description: '', patientName: '', priority: 'Medium' });

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t));
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        const task: Task = {
            id: Date.now().toString(),
            description: newTask.description,
            patientName: newTask.patientName,
            priority: newTask.priority as 'High' | 'Medium' | 'Low',
            status: 'Pending',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setTasks([task, ...tasks]);
        setIsAddTaskOpen(false);
        setNewTask({ description: '', patientName: '', priority: 'Medium' });
    };

    const filteredTasks = tasks.filter(t => filter === 'All' ? true : t.status === filter);
    const pendingCount = tasks.filter(t => t.status === 'Pending').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    const getPriorityColor = (p: string) => {
        if (p === 'High') return 'bg-red-100 text-red-600 border-red-200';
        if (p === 'Medium') return 'bg-orange-100 text-orange-600 border-orange-200';
        return 'bg-blue-100 text-blue-600 border-blue-200';
    };

    return (
        <div className="animate-fade-in-up pb-12 relative">
             <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-primary transition-colors font-medium group">
                    <div className="p-2 bg-white border border-gray-200 rounded-xl mr-3 group-hover:border-primary transition-colors">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </div>
                    <span className="hidden sm:inline">Back to Dashboard</span>
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Daily Tasks</h2>
            </div>

            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Shift Progress</h3>
                            <p className="text-sm text-gray-500">{completedCount} of {tasks.length} tasks completed</p>
                        </div>
                        <span className="text-3xl font-bold text-emerald-500">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['All', 'Pending', 'Completed'].map((f) => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f as any)}
                                className={`px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filter === f ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => setIsAddTaskOpen(true)}
                        className="bg-orange-500 text-white p-2.5 rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-200 flex-shrink-0"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                </div>

                {/* Task List */}
                <div className="space-y-3">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <div 
                                key={task.id} 
                                onClick={() => toggleTask(task.id)}
                                className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer group flex items-center gap-4 ${task.status === 'Completed' ? 'border-gray-100 opacity-75' : 'border-gray-100 hover:border-emerald-300 hover:shadow-md'}`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 group-hover:border-emerald-400'}`}>
                                    {task.status === 'Completed' && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                </div>
                                
                                <div className="flex-1">
                                    <p className={`font-bold text-gray-800 ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>{task.description}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs">
                                        <span className="text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded">Patient: {task.patientName}</span>
                                        <span className="text-gray-400 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {task.time}</span>
                                    </div>
                                </div>

                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-orange-50 text-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                            </div>
                            <h3 className="text-gray-800 font-bold mb-1">No Tasks Found</h3>
                            <p className="text-gray-400 text-sm mb-4">Your list is currently empty for this filter.</p>
                            <button onClick={() => setIsAddTaskOpen(true)} className="text-orange-500 font-bold hover:underline">Create New Task</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Task Modal */}
            {isAddTaskOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                         <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Add New Task</h3>
                            <button onClick={() => setIsAddTaskOpen(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                        <form onSubmit={handleAddTask} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <input required type="text" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-orange-500 focus:bg-white focus:ring-0 transition-all" placeholder="e.g. Administer Insulin" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Patient Name</label>
                                <input required type="text" value={newTask.patientName} onChange={e => setNewTask({...newTask, patientName: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-orange-500 focus:bg-white focus:ring-0 transition-all" placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                                <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-orange-500 focus:bg-white focus:ring-0 transition-all">
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all mt-2">Add Task</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NurseTasks;
