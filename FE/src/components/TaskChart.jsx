import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Warna
const COLORS = ["#6b7280", "#f59e0b", "#10b981"];

const TaskChart = ({ summary }) => {
  if (!summary) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex justify-center items-center h-[416px]">
            <p className="text-gray-500">Memuat data grafik...</p>
        </div>
    );
  }

  //Konversi nilai dari string ke angka 
  const data = [
    { name: "Belum Dimulai", value: parseInt(summary.pending_tasks || '0', 10) },
    { name: "Sedang Dikerjakan", value: parseInt(summary.in_progress_tasks || '0', 10) },
    { name: "Selesai", value: parseInt(summary.completed_tasks || '0', 10) },
  ].filter(item => item.value > 0); 

    // Jika tidak ada data tugas
  if (data.length === 0) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col justify-center items-center h-[416px]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Grafik Status Tugas
            </h2>
            <p className="text-gray-500">Belum ada data tugas untuk ditampilkan.</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Grafik Status Tugas
      </h2>
      <div className="h-80 w-full flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
                formatter={(value) => [`${value} tugas`, 'Jumlah']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskChart;
