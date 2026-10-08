import React, { useState, useEffect } from 'react';
import { Users, Shield, Check, Loader2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import type { UserProfile, UserRole } from '../../types/research.js';
import { useAuth } from '../../context/AuthContext.js';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    api.getUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update role.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-5">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          User Roles & Access Control (RBAC)
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Role-based permissions governing study creation, questionnaire editing, content management, and analytical results.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-xs">Loading user access directory...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
              <tr>
                <th className="p-4 font-semibold">User Profile</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Current Role</th>
                <th className="p-4 font-semibold">Assigned Privileges</th>
                <th className="p-4 font-semibold text-right">Modify Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-stone-300"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                          {u.name.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-stone-900 block">{u.name}</span>
                        <span className="text-[11px] text-stone-500 font-mono">{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-stone-700">{u.department}</td>

                  <td className="p-4">
                    <span className="font-mono font-medium text-[11px] bg-stone-100 text-stone-800 px-2 py-1 rounded">
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4 text-stone-600 text-[11px] max-w-xs">
                    {u.role === 'SUPER_ADMIN' && 'Full platform control, user roles, database resets.'}
                    {u.role === 'ADMIN' && 'Research, responses, users, news and blog publishing.'}
                    {u.role === 'RESEARCH_EDITOR' && 'Create and manage research studies, sections, questions.'}
                    {u.role === 'CONTENT_EDITOR' && 'Publish and update regulatory news and blog essays.'}
                    {u.role === 'ANALYST' && 'View analytics, results charts, and export CSV/Excel datasets.'}
                  </td>

                  <td className="p-4 text-right">
                    {currentUser?.role === 'SUPER_ADMIN' ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="p-1 bg-stone-50 border border-stone-300 rounded text-xs font-medium focus:outline-none"
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="RESEARCH_EDITOR">RESEARCH_EDITOR</option>
                        <option value="CONTENT_EDITOR">CONTENT_EDITOR</option>
                        <option value="ANALYST">ANALYST</option>
                      </select>
                    ) : (
                      <span className="text-stone-400 italic">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
