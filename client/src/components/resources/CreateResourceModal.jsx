import React, { useState } from 'react';

export default function CreateResourceModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    department: '',
    skills: '',
    availability: 'available',
    utilization: 0,
    capacity: 40,
    allocated: 0,
    hourlyRate: 0,
    skillLevel: 'intermediate'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newResource = {
      id: Date.now(),
      name: form.name,
      role: form.role,
      department: form.department,
      skills: form.skills ? form.skills.split(',').map(s => s.trim()) : [],
      availability: form.availability,
      utilization: Number(form.utilization),
      capacity: Number(form.capacity),
      allocated: Number(form.allocated),
      hourlyRate: Number(form.hourlyRate),
      projects: [],
      performance: 0,
      skillLevel: form.skillLevel
    };

    onCreate(newResource);
    onClose();
    setForm({
      name: '',
      role: '',
      department: '',
      skills: '',
      availability: 'available',
      utilization: 0,
      capacity: 40,
      allocated: 0,
      hourlyRate: 0,
      skillLevel: 'intermediate'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add Resource</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="Full name or resource name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="input"
              placeholder="Role or team"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="input"
              placeholder="Department"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <input
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="input"
              placeholder="React, Node.js, Figma"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (hours)</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                className="input"
              >
                <option value="available">available</option>
                <option value="busy">busy</option>
                <option value="overloaded">overloaded</option>
                <option value="unavailable">unavailable</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Resource</button>
          </div>
        </form>
      </div>
    </div>
  );
}
