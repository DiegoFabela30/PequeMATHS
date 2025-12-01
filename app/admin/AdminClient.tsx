"use client";

import { useEffect, useState } from 'react';

type User = { uid: string; email?: string; displayName?: string; admin?: boolean };

export default function AdminClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setUsers(data.users ?? []);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function toggleAdmin(uid: string, current: boolean) {
    try {
      const res = await fetch('/api/admin/set-admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid, makeAdmin: !current }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      fetchUsers();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-3">
        {users.map(u => (
          <div key={u.uid} className="flex items-center justify-between p-3 border rounded">
            <div>
              <div className="font-semibold">{u.displayName ?? u.email ?? u.uid}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className={`px-3 py-1 rounded-full text-sm ${u.admin ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{u.admin ? 'Admin' : 'User'}</div>
              <button onClick={() => toggleAdmin(u.uid, !!u.admin)} className="px-3 py-1 bg-blue-500 text-white rounded">{u.admin ? 'Quitar admin' : 'Hacer admin'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
