// @ts-nocheck
import React, { useState } from 'react';
import { Project } from './ProjectData';

interface ProjectFormProps {
    initialData?: Project | null;
    onSave: (project: Project) => void;
    onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Project>>(initialData || {
        name: '',
        description: '',
        status: 'Planning',
        startDate: '',
        endDate: '',
        team: [],
        tasks: [],
        progress: 0
    });

    const [teamInput, setTeamInput] = useState((formData.team || []).join(', '));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const team = teamInput.split(',').map(s => s.trim()).filter(Boolean);
        const newProject: Project = {
            ...(formData as Project),
            id: initialData?.id || `p-${Date.now()}`,
            team,
            tasks: formData.tasks || [],
            progress: formData.progress || 0
        };
        onSave(newProject);
    };

    return (
        <div className="bg-white border rounded-xl p-6 max-w-2xl mx-auto shadow-sm">
            <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        placeholder="e.g. Summer Health Camp"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        placeholder="What is this project about?"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 outline-none"
                        >
                            <option>Planning</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>On Hold</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            name="progress"
                            value={formData.progress}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Members (comma separated)</label>
                    <input
                        name="team"
                        value={teamInput}
                        onChange={(e) => setTeamInput(e.target.value)}
                        className="w-full border rounded-lg p-2 outline-none"
                        placeholder="Dr. Smith, Nurse Joy, etc."
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90">
                        Save Project
                    </button>
                    <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
