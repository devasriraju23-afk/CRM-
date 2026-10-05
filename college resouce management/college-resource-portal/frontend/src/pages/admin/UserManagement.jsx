import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Trash2 } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import { ConfirmModal } from '../../components/common/Modal.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate } from '../../utils/formatters.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import * as adminService from '../../services/adminService.js';

export default function UserManagement() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total:0, page:1, totalPages:1 });
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async (p=1) => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ role: roleFilter||undefined, search: debouncedSearch||undefined, page:p, limit:20 });
      setUsers(res.data.data||[]); setPagination(res.data.pagination||{});
    } catch { toast.error('Failed to load users.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page, roleFilter, debouncedSearch]);

  const toggleActive = async (user) => {
    try {
      await adminService.updateUser(user.id, { isActive: !user.is_active });
      setUsers(p => p.map(u => u.id===user.id ? {...u, is_active: !u.is_active} : u));
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}.`);
    } catch { toast.error('Action failed.'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteUser(deleteId);
      setDeleteId(null);
      toast.success('User deleted.');
      load(page);
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed.'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">{pagination.total || 0} users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        {['','student','faculty','admin'].map(r => (
          <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
            className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${roleFilter===r?'bg-primary-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {r ? r.charAt(0).toUpperCase()+r.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : users.length === 0 ? (
        <EmptyState icon={Search} title="No users found" />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-xs text-gray-500">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Department</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Joined</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary-700">{u.first_name?.[0]}{u.last_name?.[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.first_name} {u.last_name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge label={u.role} variant={u.role} /></td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{u.department_code || '—'}</td>
                      <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{formatDate(u.created_at)}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{u.is_active?'Active':'Inactive'}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleActive(u)} title={u.is_active?'Deactivate':'Activate'}
                            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${u.is_active?'text-orange-500':'text-green-500'}`}>
                            {u.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setDeleteId(u.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting}
        title="Delete User" message="Permanently delete this user and all their data? This cannot be undone." confirmLabel="Delete User" />
    </div>
  );
}
