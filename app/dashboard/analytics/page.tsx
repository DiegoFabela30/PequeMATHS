// app/dashboard/analytics/page.tsx

import { adminAuth } from "@/app/lib/firebase-admin";
import UserPieChart from "./UserPieChart";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  // Obtener usuarios desde Firebase Admin
  let totalUsers = 0;

  try {
    const users = await adminAuth.listUsers(1000);
    totalUsers = users.users.length;
  } catch (error) {
    console.warn('Failed to fetch users for analytics:', error);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          📊 Analytics
        </h1>

        {/* Gráfica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pasamos los datos al componente cliente */}
          <UserPieChart total={totalUsers} />
        </div>
      </div>
    </div>
  );
}
