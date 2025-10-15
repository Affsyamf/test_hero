import React, { useState, useEffect } from 'react';

const TaskFormModal = ({ isOpen, onClose, onSave, task, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignee_name: '',
        start_date: '',
        due_date: '',
        status: 'Belum Dimulai'
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                assignee_name: task.assignee_name || '',
                start_date: task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : '',
                due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
                status: task.status || 'Belum Dimulai'
            });
        } else {
            setFormData({
                title: '',
                description: '',
                assignee_name: '',
                start_date: '',
                due_date: '',
                status: 'Belum Dimulai'
            });
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
            <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{task ? 'Edit Tugas' : 'Buat Tugas Baru'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-600">Judul Tugas</label>
                        <input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Contoh: Desain Halaman Utama" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-600">Deskripsi</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Jelaskan detail tugas di sini..." rows="3" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="assignee_name" className="block mb-2 text-sm font-medium text-gray-600">Diberikan Kepada</label>
                        <input id="assignee_name" name="assignee_name" value={formData.assignee_name} onChange={handleChange} placeholder="Nama Anggota Tim" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-gray-600">Tanggal Mulai</label>
                            <input id="start_date" type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label htmlFor="due_date" className="block mb-2 text-sm font-medium text-gray-600">Batas Waktu</label>
                            <input id="due_date" type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                    </div>

                     {task && (
                        <div>
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-600">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>Belum Dimulai</option>
                                <option>Sedang Dikerjakan</option>
                                <option>Selesai</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end pt-4 space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Batal</button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
                           {isLoading ? 'Menyimpan...' : 'Simpan Tugas'}
                        </button>
                    </div>
                </form>
            </div>
            {/* animasi */}
            <style>{`
              @keyframes fade-in-scale {
                0% {
                  transform: scale(0.95);
                  opacity: 0;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              .animate-fade-in-scale {
                animation: fade-in-scale 0.2s ease-out forwards;
              }
            `}</style>
        </div>
    );
};

export default TaskFormModal;

