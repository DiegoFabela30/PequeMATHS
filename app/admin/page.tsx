import { getSessionUser } from '@/app/lib/getSessionUser';
import AdminClient from './AdminClient';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect('/log-in');
  if (!user.admin) redirect('/');

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm mt-1">Panel de control — gestión de usuarios</p>
          </div>
          <div className="p-6">
            <AdminClient />
          </div>
        </div>
      </div>
    </main>
  );
}
