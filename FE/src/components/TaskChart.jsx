import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#d1d5db", "#facc15", "#22c55e", "#3b82f6"];

const TaskChart = ({ summary }) => {
  if (!summary) {
    return <p>Loading grafik...</p>;
  }

  const data = [
    { name: "Belum Dimulai", value: summary.pending_tasks || 0 },
    { name: "Sedang Dikerjakan", value: summary.in_progress_tasks || 0 },
    { name: "Selesai", value: summary.completed_tasks || 0 },
  ];

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
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskChart;
