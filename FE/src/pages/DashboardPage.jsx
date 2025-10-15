import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import TaskFormModal from '../components/TaskFormModal';

const API_URL = 'http://localhost:5001/api';

const DashboardPage = () => {
    const { token, onLogout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('Semua');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const apiFetch = useCallback(async (endpoint, options = {}) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...options.headers,
                },
            });
            if (!response.ok) {
                const errData = await response.json();
                if (response.status === 401 || response.status === 403) {
                    onLogout(); // Token tidak valid, logout
                }
                throw new Error(errData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token, onLogout]);

    const fetchTasksAndSummary = useCallback(() => {
        const fetchTasks = async () => {
            const data = await apiFetch(`/tasks?status=${filter}`);
            if (data) setTasks(data);
        };
        const fetchSummary = async () => {
            const data = await apiFetch('/dashboard/summary');
            if (data) setSummary(data);
        };
        fetchTasks();
        fetchSummary();
    }, [apiFetch, filter]);

    useEffect(() => {
        fetchTasksAndSummary();
    }, [fetchTasksAndSummary]);
    
    const handleSaveTask = async (taskData) => {
        const method = editingTask ? 'PUT' : 'POST';
        const endpoint = editingTask ? `/tasks/${editingTask.id}` : '/tasks';
        
        const result = await apiFetch(endpoint, {
            method,
            body: JSON.stringify(taskData)
        });

        if(result) {
            fetchTasksAndSummary();
            closeModal();
        }
    };
    
    const handleDeleteTask = async (taskId) => {
      if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
        const result = await apiFetch(`/tasks/${taskId}`, { method: 'DELETE' });
        if (result) {
          fetchTasksAndSummary();
        }
      }
    };
    
    const openModal = (task = null) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Selesai': return 'bg-green-100 text-green-800';
            case 'Sedang Dikerjakan': return 'bg-yellow-100 text-yellow-800';
            case 'Belum Dimulai': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="p-6">
                <section className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                    {summary ? (
                        <>
                           <div className="p-6 bg-white rounded-lg shadow-sm"><h3 className="text-sm font-medium text-gray-500">Total Tugas</h3><p className="text-3xl font-bold text-gray-900">{summary.total_tasks}</p></div>
                           <div className="p-6 bg-white rounded-lg shadow-sm"><h3 className="text-sm font-medium text-gray-500">Belum Dimulai</h3><p className="text-3xl font-bold text-gray-900">{summary.pending_tasks}</p></div>
                           <div className="p-6 bg-white rounded-lg shadow-sm"><h3 className="text-sm font-medium text-gray-500">Sedang Dikerjakan</h3><p className="text-3xl font-bold text-gray-900">{summary.in_progress_tasks}</p></div>
                           <div className="p-6 bg-white rounded-lg shadow-sm"><h3 className="text-sm font-medium text-gray-500">Selesai</h3><p className="text-3xl font-bold text-gray-900">{summary.completed_tasks}</p></div>
                        </>
                    ) : <p>Loading summary...</p>}
                </section>

                <section className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
                        <h2 className="text-xl font-bold text-gray-800">Daftar Tugas</h2>
                        <div className="flex items-center gap-4">
                            <select onChange={(e) => setFilter(e.target.value)} value={filter} className="p-2 border rounded-lg">
                                <option>Semua</option><option>Belum Dimulai</option><option>Sedang Dikerjakan</option><option>Selesai</option>
                            </select>
                            <button onClick={() => openModal()} className="px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">+ Tugas Baru</button>
                        </div>
                    </div>
                    
                    {isLoading && tasks.length === 0 && <p>Loading data...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    
                    <div className="space-y-4">
                        {tasks.length > 0 ? tasks.map(task => (
                             <div key={task.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                <div className="flex flex-col justify-between md:flex-row">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{task.title}</h3>
                                        <p className="text-sm text-gray-600">{task.description}</p>
                                        <p className="mt-2 text-xs text-gray-500">Untuk: <strong>{task.assignee_name}</strong></p>
                                    </div>
                                    <div className="flex flex-col items-start mt-4 space-y-2 md:mt-0 md:items-end">
                                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>{task.status}</span>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => openModal(task)} className="px-3 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600">Edit</button>
                                            <button onClick={() => handleDeleteTask(task.id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">Hapus</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : !isLoading && <p>Belum ada tugas.</p>}
                    </div>
                </section>
            </main>

            <TaskFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveTask} task={editingTask} isLoading={isLoading} />
        </div>
    );
};

export default DashboardPage;
