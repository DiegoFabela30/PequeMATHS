"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function UserPieChart({ total }: { total: number }) {
  const data = [
    { name: "Usuarios Registrados", value: total },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Usuarios Registrados
      </h2>

      <PieChart width={350} height={350}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#4F46E5"
          label
        >
          <Cell fill="#4F46E5" />
        </Pie>

        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </div>
  );
}
