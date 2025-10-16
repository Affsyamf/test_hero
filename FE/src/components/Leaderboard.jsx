import React from 'react';

const Leaderboard = ({ tasks }) => {
  if (!tasks || tasks.length === 0) return <p>Tidak ada data tugas.</p>;

  // Hitung jumlah tugas per user
  const taskCountByUser = tasks.reduce((acc, t) => {
    const name = t.assignee_name || 'Tanpa Nama';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  // Urutkan dari yang terbanyak
  const sorted = Object.entries(taskCountByUser)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Anggota Paling Aktif</h2>
      <ul>
        {sorted.map(([name, count], i) => (
          <li key={i} className="flex justify-between border-b border-gray-100 py-2">
            <span className="font-medium">{i + 1}. {name}</span>
            <span className="text-gray-500">{count} tugas</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;